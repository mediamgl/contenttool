import { supabase } from '../lib/supabase';

interface ApiKey {
  id: string;
  provider: 'anthropic' | 'openai' | 'google' | 'other';
  keyName: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

export const apiKeyService = {
  async saveApiKey(
    provider: 'anthropic' | 'openai' | 'google' | 'other',
    keyName: string,
    apiKey: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const encryptedKey = btoa(apiKey);

      const { error } = await supabase.from('api_keys').upsert(
        {
          user_id: user.id,
          provider,
          key_name: keyName,
          encrypted_key: encryptedKey,
          is_active: true,
        },
        {
          onConflict: 'user_id,provider,key_name',
        }
      );

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Save API key error:', error);
      return { success: false, error: error.message || 'Failed to save API key' };
    }
  },

  async getApiKeys(): Promise<{ success: boolean; data?: ApiKey[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('api_keys')
        .select('id, provider, key_name, is_active, last_used_at, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const apiKeys: ApiKey[] = (data || []).map(key => ({
        id: key.id,
        provider: key.provider as any,
        keyName: key.key_name,
        isActive: key.is_active || false,
        lastUsedAt: key.last_used_at || undefined,
        createdAt: key.created_at,
      }));

      return { success: true, data: apiKeys };
    } catch (error: any) {
      console.error('Get API keys error:', error);
      return { success: false, error: error.message || 'Failed to get API keys' };
    }
  },

  async deleteApiKey(keyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Delete API key error:', error);
      return { success: false, error: error.message || 'Failed to delete API key' };
    }
  },

  async toggleApiKey(
    keyId: string,
    isActive: boolean
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: isActive })
        .eq('id', keyId)
        .eq('user_id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Toggle API key error:', error);
      return { success: false, error: error.message || 'Failed to toggle API key' };
    }
  },
};
