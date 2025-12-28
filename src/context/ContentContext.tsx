import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ContentItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  contentType: 'blog' | 'social' | 'script' | 'outline' | 'thread';
  targetPlatform: string;
  wordCount: number;
  characterCount: number;
  status: 'draft' | 'editing' | 'ready' | 'published';
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
  addContent: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  getContent: (id: string) => ContentItem | undefined;

  // Ideas
  ideas: ContentIdea[];
  addIdea: (idea: Omit<ContentIdea, 'id' | 'createdAt'>) => string;
  updateIdea: (id: string, updates: Partial<ContentIdea>) => void;
  deleteIdea: (id: string) => void;
  getIdea: (id: string) => ContentIdea | undefined;
  getSavedIdeas: () => ContentIdea[];

  // Outlines
  outlines: ContentOutline[];
  addOutline: (outline: Omit<ContentOutline, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOutline: (id: string, updates: Partial<ContentOutline>) => void;
  deleteOutline: (id: string) => void;
  getOutline: (id: string) => ContentOutline | undefined;

  // Bulk operations
  getContentByStatus: (status: ContentItem['status']) => ContentItem[];
  getContentByType: (type: ContentItem['contentType']) => ContentItem[];
  searchContent: (query: string) => ContentItem[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [outlines, setOutlines] = useState<ContentOutline[]>([]);

  const addContent = (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    const newItem: ContentItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setContent([...content, newItem]);
    return id;
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setContent(
      content.map(item =>
        item.id === id
          ? {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const deleteContent = (id: string) => {
    setContent(content.filter(item => item.id !== id));
  };

  const getContent = (id: string) => {
    return content.find(item => item.id === id);
  };

  const addIdea = (idea: Omit<ContentIdea, 'id' | 'createdAt'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newIdea: ContentIdea = {
      ...idea,
      id,
      createdAt: new Date().toISOString(),
    };
    setIdeas([...ideas, newIdea]);
    return id;
  };

  const updateIdea = (id: string, updates: Partial<ContentIdea>) => {
    setIdeas(ideas.map(idea => (idea.id === id ? { ...idea, ...updates } : idea)));
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const getIdea = (id: string) => {
    return ideas.find(idea => idea.id === id);
  };

  const getSavedIdeas = () => {
    return ideas.filter(idea => idea.isSaved);
  };

  const addOutline = (
    outline: Omit<ContentOutline, 'id' | 'createdAt' | 'updatedAt'>
  ): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    const newOutline: ContentOutline = {
      ...outline,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setOutlines([...outlines, newOutline]);
    return id;
  };

  const updateOutline = (id: string, updates: Partial<ContentOutline>) => {
    setOutlines(
      outlines.map(outline =>
        outline.id === id
          ? {
              ...outline,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : outline
      )
    );
  };

  const deleteOutline = (id: string) => {
    setOutlines(outlines.filter(outline => outline.id !== id));
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
        ideas,
        addIdea,
        updateIdea,
        deleteIdea,
        getIdea,
        getSavedIdeas,
        outlines,
        addOutline,
        updateOutline,
        deleteOutline,
        getOutline,
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
