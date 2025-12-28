import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { errorLogger, ErrorCategory } from '../services/errorLoggingService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  preferences: {
    timezone: string;
    defaultPlatform: string;
    defaultContentType: string;
    defaultAIProvider: string;
    writingTone: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session and profile on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error: any) {
        console.error('Failed to initialize auth:', error);
        await errorLogger.logAuthError('Failed to initialize authentication', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      // Get user preferences
      const { data: preferences, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      // If profile doesn't exist, create it
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: supabaseUser.id,
            name: supabaseUser.email?.split('@')[0] || 'User',
            role: 'user',
          })
          .select()
          .maybeSingle();

        if (createError || !newProfile) throw new Error('Failed to create user profile');

        // Create default preferences
        await supabase.from('user_preferences').insert({
          user_id: supabaseUser.id,
          timezone: 'UTC',
          default_platform: 'medium',
          default_content_type: 'blog',
          default_ai_provider: 'anthropic',
          writing_tone: 'professional',
        });

        const { data: newPrefs } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .maybeSingle();

        setUser({
          id: newProfile.user_id,
          email: supabaseUser.email || '',
          name: newProfile.name,
          role: newProfile.role as 'user' | 'admin',
          avatar: newProfile.avatar_url || undefined,
          preferences: {
            timezone: newPrefs?.timezone || 'UTC',
            defaultPlatform: newPrefs?.default_platform || 'medium',
            defaultContentType: newPrefs?.default_content_type || 'blog',
            defaultAIProvider: newPrefs?.default_ai_provider || 'anthropic',
            writingTone: newPrefs?.writing_tone || 'professional',
          },
        });
      } else {
        setUser({
          id: profile.user_id,
          email: supabaseUser.email || '',
          name: profile.name,
          role: profile.role as 'user' | 'admin',
          avatar: profile.avatar_url || undefined,
          preferences: {
            timezone: preferences?.timezone || 'UTC',
            defaultPlatform: preferences?.default_platform || 'medium',
            defaultContentType: preferences?.default_content_type || 'blog',
            defaultAIProvider: preferences?.default_ai_provider || 'anthropic',
            writingTone: preferences?.writing_tone || 'professional',
          },
        });
      }
    } catch (error: any) {
      console.error('Failed to load user profile:', error);
      await errorLogger.logAuthError('Failed to load user profile', error, {
        userId: supabaseUser.id,
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      await errorLogger.logAuthError('Login failed', error, { email });
      throw new Error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        await supabase.from('user_profiles').insert({
          user_id: data.user.id,
          name,
          role: 'user',
        });

        // Create default preferences
        await supabase.from('user_preferences').insert({
          user_id: data.user.id,
          timezone: 'UTC',
          default_platform: 'medium',
          default_content_type: 'blog',
          default_ai_provider: 'anthropic',
          writing_tone: 'professional',
        });

        await loadUserProfile(data.user);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      await errorLogger.logAuthError('Registration failed', error, { email, name });
      throw new Error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: updates.name,
          avatar_url: updates.avatar,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>) => {
    if (!user) throw new Error('No user logged in');

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          timezone: preferences.timezone,
          default_platform: preferences.defaultPlatform,
          default_content_type: preferences.defaultContentType,
          default_ai_provider: preferences.defaultAIProvider,
          writing_tone: preferences.writingTone,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        preferences: { ...user.preferences, ...preferences },
      });
    } catch (error: any) {
      console.error('Update preferences error:', error);
      throw new Error(error.message || 'Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
