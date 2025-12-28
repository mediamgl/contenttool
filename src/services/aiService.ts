import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const aiService = {
  async generateIdeas(
    businessDescription: string,
    contentTypes: string[],
    count = 5
  ): Promise<ApiResponse<any[]>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      };

      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-ideas`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ businessDescription, contentTypes, count }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Failed to generate ideas' };
      }

      const result = await response.json();
      const transformedIdeas = result.ideas.map((idea: any) => ({
        id: crypto.randomUUID(),
        title: idea.title,
        description: idea.description,
        category: idea.category,
        suggestedType: idea.contentType,
        suggestedPlatforms: idea.platforms,
        isSaved: false,
      }));
      return { success: true, data: transformedIdeas };
    } catch (error: any) {
      console.error('Generate ideas error:', error);
      return { success: false, error: error.message || 'Failed to generate ideas' };
    }
  },

  async generateHooks(
    topic: string,
    contentType: string,
    count = 5
  ): Promise<ApiResponse<string[]>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-hooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ topic, contentType, count }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Failed to generate hooks' };
      }

      const result = await response.json();
      return { success: true, data: result.hooks };
    } catch (error: any) {
      console.error('Generate hooks error:', error);
      return { success: false, error: error.message || 'Failed to generate hooks' };
    }
  },

  async generateOutline(
    topic: string,
    hook: string,
    contentType: string
  ): Promise<ApiResponse<any>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-outline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ topic, hook, contentType }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Failed to generate outline' };
      }

      const result = await response.json();
      return { success: true, data: result.outline };
    } catch (error: any) {
      console.error('Generate outline error:', error);
      return { success: false, error: error.message || 'Failed to generate outline' };
    }
  },

  async expandText(text: string): Promise<ApiResponse<string>> {
    return this.performTextOperation(text, 'expand');
  },

  async condenseText(text: string): Promise<ApiResponse<string>> {
    return this.performTextOperation(text, 'condense');
  },

  async improveText(text: string): Promise<ApiResponse<string>> {
    return this.performTextOperation(text, 'improve');
  },

  async rephraseText(text: string): Promise<ApiResponse<string>> {
    return this.performTextOperation(text, 'rephrase');
  },

  async performTextOperation(
    text: string,
    operation: 'expand' | 'condense' | 'improve' | 'rephrase'
  ): Promise<ApiResponse<string>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-text-operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ text, operation }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Failed to process text' };
      }

      const result = await response.json();
      return { success: true, data: result.result };
    } catch (error: any) {
      console.error('Text operation error:', error);
      return { success: false, error: error.message || 'Failed to process text' };
    }
  },

  async analyzeContent(text: string, title?: string): Promise<ApiResponse<any>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ text, title }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error || 'Failed to analyze content' };
      }

      const result = await response.json();
      return { success: true, data: result.analysis };
    } catch (error: any) {
      console.error('Analyze content error:', error);
      return { success: false, error: error.message || 'Failed to analyze content' };
    }
  },
};
