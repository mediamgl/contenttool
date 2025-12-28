import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface ContentItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  contentType: 'blog' | 'social' | 'script' | 'outline' | 'thread';
  targetPlatform: string;
  wordCount: number;
  characterCount: number;
  status: 'draft' | 'ready' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  tags: string[];
}

export interface ContentIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  suggestedType: 'blog' | 'social' | 'script' | 'outline';
  suggestedPlatforms: string[];
  status: 'new' | 'saved' | 'outlined' | 'written' | 'published';
  isSaved: boolean;
  createdAt: string;
}

export interface ContentOutline {
  id: string;
  userId: string;
  contentId?: string;
  ideaId?: string;
  title: string;
  topic: string;
  hook: string;
  hookAlternatives: string[];
  sections: {
    id: number;
    heading: string;
    keyPoints: string[];
    research?: string;
    researchSource?: string;
    example?: string;
  }[];
  cta: string;
  fullDraft?: string;
  contentType: 'blog' | 'social' | 'script' | 'course' | 'ebook';
  status: 'draft' | 'ready' | 'written';
  createdAt: string;
  updatedAt: string;
}

export interface ContentContextType {
  // Content Items
  content: ContentItem[];
  addContent: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  getContent: (id: string) => ContentItem | undefined;
  refreshContent: () => Promise<void>;

  // Ideas
  ideas: ContentIdea[];
  addIdea: (idea: Omit<ContentIdea, 'id' | 'createdAt'>) => Promise<string>;
  updateIdea: (id: string, updates: Partial<ContentIdea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  getIdea: (id: string) => ContentIdea | undefined;
  getSavedIdeas: () => ContentIdea[];
  refreshIdeas: () => Promise<void>;

  // Outlines
  outlines: ContentOutline[];
  addOutline: (outline: Omit<ContentOutline, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateOutline: (id: string, updates: Partial<ContentOutline>) => Promise<void>;
  deleteOutline: (id: string) => Promise<void>;
  getOutline: (id: string) => ContentOutline | undefined;
  refreshOutlines: () => Promise<void>;

  // Bulk operations
  getContentByStatus: (status: ContentItem['status']) => ContentItem[];
  getContentByType: (type: ContentItem['contentType']) => ContentItem[];
  searchContent: (query: string) => ContentItem[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [outlines, setOutlines] = useState<ContentOutline[]>([]);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshContent();
      refreshIdeas();
      refreshOutlines();
    } else {
      setContent([]);
      setIdeas([]);
      setOutlines([]);
    }
  }, [isAuthenticated, user]);

  const refreshContent = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setContent(
          data.map(item => ({
            id: item.id,
            userId: item.user_id,
            title: item.title,
            content: item.content_body,
            contentType: item.content_type as any,
            targetPlatform: item.target_platform || '',
            wordCount: item.word_count || 0,
            characterCount: item.character_count || 0,
            status: item.status as any,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            publishedAt: item.published_at || undefined,
            tags: item.tags || [],
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const addContent = async (
    item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('content')
        .insert({
          user_id: user.id,
          title: item.title,
          content_body: item.content,
          content_type: item.contentType,
          status: item.status,
          word_count: item.wordCount,
          character_count: item.characterCount,
          tags: item.tags,
          target_platform: item.targetPlatform,
        })
        .select()
        .single();

      if (error) throw error;

      await refreshContent();
      return data.id;
    } catch (error: any) {
      console.error('Failed to add content:', error);
      throw new Error(error.message || 'Failed to add content');
    }
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.content !== undefined) dbUpdates.content_body = updates.content;
      if (updates.contentType !== undefined) dbUpdates.content_type = updates.contentType;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.wordCount !== undefined) dbUpdates.word_count = updates.wordCount;
      if (updates.characterCount !== undefined) dbUpdates.character_count = updates.characterCount;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.targetPlatform !== undefined) dbUpdates.target_platform = updates.targetPlatform;
      if (updates.publishedAt !== undefined) dbUpdates.published_at = updates.publishedAt;

      const { error } = await supabase.from('content').update(dbUpdates).eq('id', id).eq('user_id', user.id);

      if (error) throw error;

      await refreshContent();
    } catch (error: any) {
      console.error('Failed to update content:', error);
      throw new Error(error.message || 'Failed to update content');
    }
  };

  const deleteContent = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.from('content').delete().eq('id', id).eq('user_id', user.id);

      if (error) throw error;

      setContent(content.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Failed to delete content:', error);
      throw new Error(error.message || 'Failed to delete content');
    }
  };

  const getContent = (id: string) => {
    return content.find(item => item.id === id);
  };

  const refreshIdeas = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setIdeas(
          data.map(idea => ({
            id: idea.id,
            userId: idea.user_id,
            title: idea.title,
            description: idea.description,
            category: idea.category || '',
            suggestedType: 'blog' as any,
            suggestedPlatforms: idea.suggested_platforms || [],
            status: 'saved' as any,
            isSaved: idea.is_saved || true,
            createdAt: idea.created_at,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load ideas:', error);
    }
  };

  const addIdea = async (idea: Omit<ContentIdea, 'id' | 'createdAt'>): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert({
          user_id: user.id,
          title: idea.title,
          description: idea.description,
          category: idea.category,
          suggested_platforms: idea.suggestedPlatforms,
          is_saved: idea.isSaved,
        })
        .select()
        .single();

      if (error) throw error;

      await refreshIdeas();
      return data.id;
    } catch (error: any) {
      console.error('Failed to add idea:', error);
      throw new Error(error.message || 'Failed to add idea');
    }
  };

  const updateIdea = async (id: string, updates: Partial<ContentIdea>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.isSaved !== undefined) dbUpdates.is_saved = updates.isSaved;

      const { error } = await supabase.from('ideas').update(dbUpdates).eq('id', id).eq('user_id', user.id);

      if (error) throw error;

      await refreshIdeas();
    } catch (error: any) {
      console.error('Failed to update idea:', error);
      throw new Error(error.message || 'Failed to update idea');
    }
  };

  const deleteIdea = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.from('ideas').delete().eq('id', id).eq('user_id', user.id);

      if (error) throw error;

      setIdeas(ideas.filter(idea => idea.id !== id));
    } catch (error: any) {
      console.error('Failed to delete idea:', error);
      throw new Error(error.message || 'Failed to delete idea');
    }
  };

  const getIdea = (id: string) => {
    return ideas.find(idea => idea.id === id);
  };

  const getSavedIdeas = () => {
    return ideas.filter(idea => idea.isSaved);
  };

  const refreshOutlines = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('outlines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setOutlines(
          data.map(outline => ({
            id: outline.id,
            userId: outline.user_id,
            title: outline.title,
            topic: outline.title,
            hook: outline.hook,
            hookAlternatives: outline.hook_alternatives || [],
            sections: (outline.sections as any) || [],
            cta: outline.cta || '',
            contentType: 'blog' as any,
            status: (outline.status as any) || 'draft',
            createdAt: outline.created_at,
            updatedAt: outline.updated_at,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load outlines:', error);
    }
  };

  const addOutline = async (
    outline: Omit<ContentOutline, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('outlines')
        .insert({
          user_id: user.id,
          title: outline.title,
          hook: outline.hook,
          hook_alternatives: outline.hookAlternatives,
          sections: outline.sections as any,
          cta: outline.cta,
          status: outline.status,
        })
        .select()
        .single();

      if (error) throw error;

      await refreshOutlines();
      return data.id;
    } catch (error: any) {
      console.error('Failed to add outline:', error);
      throw new Error(error.message || 'Failed to add outline');
    }
  };

  const updateOutline = async (id: string, updates: Partial<ContentOutline>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.hook !== undefined) dbUpdates.hook = updates.hook;
      if (updates.hookAlternatives !== undefined) dbUpdates.hook_alternatives = updates.hookAlternatives;
      if (updates.sections !== undefined) dbUpdates.sections = updates.sections;
      if (updates.cta !== undefined) dbUpdates.cta = updates.cta;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase.from('outlines').update(dbUpdates).eq('id', id).eq('user_id', user.id);

      if (error) throw error;

      await refreshOutlines();
    } catch (error: any) {
      console.error('Failed to update outline:', error);
      throw new Error(error.message || 'Failed to update outline');
    }
  };

  const deleteOutline = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.from('outlines').delete().eq('id', id).eq('user_id', user.id);

      if (error) throw error;

      setOutlines(outlines.filter(outline => outline.id !== id));
    } catch (error: any) {
      console.error('Failed to delete outline:', error);
      throw new Error(error.message || 'Failed to delete outline');
    }
  };

  const getOutline = (id: string) => {
    return outlines.find(outline => outline.id === id);
  };

  const getContentByStatus = (status: ContentItem['status']) => {
    return content.filter(item => item.status === status);
  };

  const getContentByType = (type: ContentItem['contentType']) => {
    return content.filter(item => item.contentType === type);
  };

  const searchContent = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return content.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        addContent,
        updateContent,
        deleteContent,
        getContent,
        refreshContent,
        ideas,
        addIdea,
        updateIdea,
        deleteIdea,
        getIdea,
        getSavedIdeas,
        refreshIdeas,
        outlines,
        addOutline,
        updateOutline,
        deleteOutline,
        getOutline,
        refreshOutlines,
        getContentByStatus,
        getContentByType,
        searchContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
