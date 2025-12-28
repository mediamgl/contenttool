import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface PlatformConnection {
  id: string;
  platform: string;
  isConnected: boolean;
  platformUsername?: string;
  connectedAt?: string;
}

export const publishingService = {
  async getConnections(): Promise<{
    success: boolean;
    data?: PlatformConnection[];
    error?: string;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('publishing_connections')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const connections: PlatformConnection[] = (data || []).map(conn => ({
        id: conn.id,
        platform: conn.platform,
        isConnected: conn.is_connected || false,
        platformUsername: conn.platform_username || undefined,
        connectedAt: conn.created_at,
      }));

      return { success: true, data: connections };
    } catch (error: any) {
      console.error('Get connections error:', error);
      return { success: false, error: error.message || 'Failed to get connections' };
    }
  },

  async connectPlatform(
    platform: string
  ): Promise<{ success: boolean; authUrl?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data: existing } = await supabase
        .from('publishing_connections')
        .select('id')
        .eq('user_id', user.id)
        .eq('platform', platform)
        .maybeSingle();

      if (!existing) {
        await supabase.from('publishing_connections').insert({
          user_id: user.id,
          platform,
          is_connected: false,
        });
      }

      return {
        success: true,
        authUrl: `/oauth/${platform}/authorize`,
      };
    } catch (error: any) {
      console.error('Connect platform error:', error);
      return { success: false, error: error.message || 'Failed to connect platform' };
    }
  },

  async disconnectPlatform(platform: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('publishing_connections')
        .update({
          is_connected: false,
          access_token: null,
          refresh_token: null,
          platform_user_id: null,
          platform_username: null,
        })
        .eq('user_id', user.id)
        .eq('platform', platform);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Disconnect platform error:', error);
      return { success: false, error: error.message || 'Failed to disconnect platform' };
    }
  },

  async publishContent(
    contentId: string,
    platforms: string[]
  ): Promise<{ success: boolean; results?: any[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();

      if (!user || !session) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data: content } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .eq('user_id', user.id)
        .single();

      if (!content) {
        return { success: false, error: 'Content not found' };
      }

      const results = [];

      for (const platform of platforms) {
        const { data: published, error: publishError } = await supabase
          .from('published_content')
          .insert({
            user_id: user.id,
            content_id: contentId,
            platform,
            status: 'pending',
          })
          .select()
          .single();

        if (publishError) {
          results.push({
            platform,
            success: false,
            error: publishError.message,
          });
          continue;
        }

        results.push({
          platform,
          success: true,
          publishedContentId: published.id,
        });
      }

      return { success: true, results };
    } catch (error: any) {
      console.error('Publish content error:', error);
      return { success: false, error: error.message || 'Failed to publish content' };
    }
  },

  async getPublishedContent(contentId?: string): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      let query = supabase
        .from('published_content')
        .select('*, content(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (contentId) {
        query = query.eq('content_id', contentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get published content error:', error);
      return { success: false, error: error.message || 'Failed to get published content' };
    }
  },

  async scheduleContent(
    contentId: string,
    platform: string,
    scheduledFor: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase.from('published_content').insert({
        user_id: user.id,
        content_id: contentId,
        platform,
        status: 'scheduled',
        scheduled_for: scheduledFor,
      });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Schedule content error:', error);
      return { success: false, error: error.message || 'Failed to schedule content' };
    }
  },
};
