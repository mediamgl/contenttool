export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          user_id: string
          title: string
          content_body: string
          content_type: 'blog' | 'social' | 'script' | 'outline' | 'thread' | 'other'
          status: 'draft' | 'ready' | 'published' | 'archived'
          word_count: number
          character_count: number
          tags: string[]
          target_platform: string | null
          metadata: Json
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content_body?: string
          content_type: 'blog' | 'social' | 'script' | 'outline' | 'thread' | 'other'
          status?: 'draft' | 'ready' | 'published' | 'archived'
          word_count?: number
          character_count?: number
          tags?: string[]
          target_platform?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content_body?: string
          content_type?: 'blog' | 'social' | 'script' | 'outline' | 'thread' | 'other'
          status?: 'draft' | 'ready' | 'published' | 'archived'
          word_count?: number
          character_count?: number
          tags?: string[]
          target_platform?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: string | null
          tags: string[]
          content_types: string[]
          suggested_platforms: string[]
          is_saved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category?: string | null
          tags?: string[]
          content_types?: string[]
          suggested_platforms?: string[]
          is_saved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: string | null
          tags?: string[]
          content_types?: string[]
          suggested_platforms?: string[]
          is_saved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      outlines: {
        Row: {
          id: string
          user_id: string
          title: string
          hook: string
          hook_alternatives: string[]
          sections: Json
          cta: string | null
          status: 'draft' | 'ready' | 'archived' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          hook: string
          hook_alternatives?: string[]
          sections?: Json
          cta?: string | null
          status?: 'draft' | 'ready' | 'archived' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          hook?: string
          hook_alternatives?: string[]
          sections?: Json
          cta?: string | null
          status?: 'draft' | 'ready' | 'archived' | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_base_documents: {
        Row: {
          id: string
          user_id: string
          title: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          description: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          description?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          description?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      publishing_connections: {
        Row: {
          id: string
          user_id: string
          platform: 'medium' | 'twitter' | 'linkedin' | 'bluesky' | 'substack' | 'dev' | 'hashnode'
          is_connected: boolean
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          platform_user_id: string | null
          platform_username: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'medium' | 'twitter' | 'linkedin' | 'bluesky' | 'substack' | 'dev' | 'hashnode'
          is_connected?: boolean
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          platform_user_id?: string | null
          platform_username?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'medium' | 'twitter' | 'linkedin' | 'bluesky' | 'substack' | 'dev' | 'hashnode'
          is_connected?: boolean
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          platform_user_id?: string | null
          platform_username?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      published_content: {
        Row: {
          id: string
          user_id: string
          content_id: string
          platform: string
          platform_post_id: string | null
          platform_url: string | null
          status: 'pending' | 'published' | 'failed' | 'scheduled'
          scheduled_for: string | null
          published_at: string | null
          error_message: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          platform: string
          platform_post_id?: string | null
          platform_url?: string | null
          status?: 'pending' | 'published' | 'failed' | 'scheduled'
          scheduled_for?: string | null
          published_at?: string | null
          error_message?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          platform?: string
          platform_post_id?: string | null
          platform_url?: string | null
          status?: 'pending' | 'published' | 'failed' | 'scheduled'
          scheduled_for?: string | null
          published_at?: string | null
          error_message?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          published_content_id: string
          views: number
          likes: number
          shares: number
          comments: number
          engagement_rate: number
          click_through_rate: number
          metadata: Json
          recorded_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          published_content_id: string
          views?: number
          likes?: number
          shares?: number
          comments?: number
          engagement_rate?: number
          click_through_rate?: number
          metadata?: Json
          recorded_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          published_content_id?: string
          views?: number
          likes?: number
          shares?: number
          comments?: number
          engagement_rate?: number
          click_through_rate?: number
          metadata?: Json
          recorded_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          provider: 'anthropic' | 'openai' | 'google' | 'other'
          key_name: string
          encrypted_key: string
          is_active: boolean
          last_used_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider: 'anthropic' | 'openai' | 'google' | 'other'
          key_name: string
          encrypted_key: string
          is_active?: boolean
          last_used_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          provider?: 'anthropic' | 'openai' | 'google' | 'other'
          key_name?: string
          encrypted_key?: string
          is_active?: boolean
          last_used_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          timezone: string
          default_platform: string
          default_content_type: string
          default_ai_provider: string
          writing_tone: string
          notifications_enabled: boolean
          email_notifications: boolean
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          timezone?: string
          default_platform?: string
          default_content_type?: string
          default_ai_provider?: string
          writing_tone?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          timezone?: string
          default_platform?: string
          default_content_type?: string
          default_ai_provider?: string
          writing_tone?: string
          notifications_enabled?: boolean
          email_notifications?: boolean
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
