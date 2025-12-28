// Mock API Service for ContentFlow
// This simulates backend API calls with realistic delays

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> => {
    await delay(500);
    if (email && password) {
      return {
        success: true,
        data: {
          token: 'mock_token_' + Date.now(),
          user: {
            id: '1',
            email,
            name: email.split('@')[0],
            role: 'user',
          },
        },
      };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse<{ token: string; user: any }>> => {
    await delay(600);
    return {
      success: true,
      data: {
        token: 'mock_token_' + Date.now(),
        user: {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role: 'user',
        },
      },
    };
  },
};

// Content API
export const contentAPI = {
  getContentList: async (status?: string): Promise<ApiResponse<any[]>> => {
    await delay(400);
    const mockContent = [
      {
        id: '1',
        title: 'Getting Started with AI',
        contentType: 'blog',
        status: 'draft',
        wordCount: 1250,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'Quick AI Tips',
        contentType: 'social',
        status: 'ready',
        wordCount: 150,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    return { success: true, data: status ? mockContent.filter(c => c.status === status) : mockContent };
  },

  createContent: async (data: any): Promise<ApiResponse<any>> => {
    await delay(300);
    return {
      success: true,
      data: { id: Math.random().toString(36).substr(2, 9), ...data, createdAt: new Date().toISOString() },
    };
  },

  updateContent: async (id: string, data: any): Promise<ApiResponse<any>> => {
    await delay(300);
    return { success: true, data: { id, ...data, updatedAt: new Date().toISOString() } };
  },

  deleteContent: async (id: string): Promise<ApiResponse<null>> => {
    await delay(200);
    return { success: true };
  },
};

// Ideas API
export const ideasAPI = {
  generateIdeas: async (input: string, contentTypes: string[]): Promise<ApiResponse<any[]>> => {
    await delay(1500); // Simulate AI processing
    const ideas = [
      {
        id: Math.random().toString(36).substr(2, 9),
        title: 'The Future of ' + input,
        description: `Explore emerging trends in ${input}`,
        category: 'trends',
        suggestedType: contentTypes[0] || 'blog',
        suggestedPlatforms: ['medium', 'linkedin'],
        status: 'new',
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        title: `${input} Best Practices`,
        description: `Essential tips and tricks for ${input}`,
        category: 'guide',
        suggestedType: contentTypes[0] || 'blog',
        suggestedPlatforms: ['medium', 'dev'],
        status: 'new',
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        title: `Why ${input} Matters in 2025`,
        description: `Understanding the importance of ${input}`,
        category: 'opinion',
        suggestedType: 'social',
        suggestedPlatforms: ['twitter', 'linkedin'],
        status: 'new',
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
    ];
    return { success: true, data: ideas };
  },

  saveIdea: async (id: string): Promise<ApiResponse<null>> => {
    await delay(200);
    return { success: true };
  },

  getSavedIdeas: async (): Promise<ApiResponse<any[]>> => {
    await delay(400);
    return {
      success: true,
      data: [
        {
          id: '1',
          title: 'Saved Idea 1',
          description: 'This is a previously saved idea',
          status: 'saved',
          isSaved: true,
        },
      ],
    };
  },
};

// Content Builder API
export const builderAPI = {
  generateHooks: async (topic: string): Promise<ApiResponse<string[]>> => {
    await delay(1200);
    return {
      success: true,
      data: [
        `Discover how ${topic} is changing everything`,
        `The surprising truth about ${topic}`,
        `Why ${topic} matters more than you think`,
        `5 things you didn't know about ${topic}`,
        `The complete guide to understanding ${topic}`,
      ],
    };
  },

  generateOutline: async (topic: string, hook: string): Promise<ApiResponse<any>> => {
    await delay(1500);
    return {
      success: true,
      data: {
        id: Math.random().toString(36).substr(2, 9),
        title: topic,
        hook,
        hookAlternatives: [],
        sections: [
          {
            id: 1,
            heading: 'Introduction to ' + topic,
            keyPoints: ['Context', 'Why it matters', 'What we will cover'],
          },
          {
            id: 2,
            heading: 'Key Concepts',
            keyPoints: ['Definition', 'Historical context', 'Current applications'],
          },
          {
            id: 3,
            heading: 'Best Practices',
            keyPoints: ['Tip 1', 'Tip 2', 'Tip 3', 'Common mistakes'],
          },
          {
            id: 4,
            heading: 'Conclusion',
            keyPoints: ['Summary', 'Key takeaways', 'Next steps'],
          },
        ],
        cta: 'Learn more and get started today',
        status: 'draft',
      },
    };
  },
};

// AI Processing API
export const aiAPI = {
  expandText: async (text: string): Promise<ApiResponse<string>> => {
    await delay(1000);
    return {
      success: true,
      data: text + ' [EXPANDED with additional context and examples...]',
    };
  },

  condenseText: async (text: string): Promise<ApiResponse<string>> => {
    await delay(800);
    return {
      success: true,
      data: text.substring(0, Math.floor(text.length / 2)) + '...',
    };
  },

  rephraseText: async (text: string): Promise<ApiResponse<string>> => {
    await delay(800);
    return {
      success: true,
      data: '[Rephrased: Alternative version of the provided text with improved clarity...]',
    };
  },

  improveText: async (text: string): Promise<ApiResponse<string>> => {
    await delay(1000);
    return {
      success: true,
      data: '[Improved version with better grammar, flow, and engagement...]',
    };
  },

  analyzeText: async (text: string): Promise<ApiResponse<any>> => {
    await delay(800);
    return {
      success: true,
      data: {
        readabilityScore: 75,
        sentiment: 'professional',
        tone: 'informative',
        keywordCount: 12,
        seoScore: 82,
        suggestions: ['Add more examples', 'Improve section transitions', 'Enhance call-to-action'],
      },
    };
  },
};

// Publishing API
export const publishingAPI = {
  getPlatforms: async (): Promise<ApiResponse<any[]>> => {
    await delay(300);
    return {
      success: true,
      data: [
        { id: 'medium', name: 'Medium', icon: '📱', connected: false },
        { id: 'twitter', name: 'Twitter/X', icon: '𝕏', connected: false },
        { id: 'linkedin', name: 'LinkedIn', icon: '💼', connected: false },
        { id: 'bluesky', name: 'BlueSky', icon: '🦋', connected: false },
        { id: 'substack', name: 'Substack', icon: '📧', connected: false },
      ],
    };
  },

  publishContent: async (contentId: string, platforms: string[]): Promise<ApiResponse<any>> => {
    await delay(2000);
    return {
      success: true,
      data: {
        contentId,
        platforms: platforms.map(p => ({ platform: p, status: 'published', url: `https://example.com/${p}/${contentId}` })),
        publishedAt: new Date().toISOString(),
      },
    };
  },
};

// Admin API
export const adminAPI = {
  getStats: async (): Promise<ApiResponse<any>> => {
    await delay(500);
    return {
      success: true,
      data: {
        totalUsers: 1250,
        totalContent: 8450,
        totalDocuments: 320,
        activeUsers: 340,
        contentThisWeek: 125,
        documentsThisMonth: 45,
      },
    };
  },
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    await delay(100);
    return true;
  } catch {
    return false;
  }
};
