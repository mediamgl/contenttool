/**
 * @krisspy-file
 * @type page
 * @name "Ideas"
 * @title "Ideas Generator"
 * @description "Generate and browse AI-powered content ideas"
 * @routes ["/ideas"]
 * @requiresAuth false
 */

import React, { useState } from 'react';
import { Lightbulb, Sparkles, Bookmark, Trash2, ChevronRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { aiService } from '../services/aiService';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  suggestedType: string;
  suggestedPlatforms: string[];
  isSaved: boolean;
}

export default function Ideas() {
  const { addIdea, deleteIdea, ideas, getSavedIdeas } = useContent();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');
  const [businessDescription, setBusinessDescription] = useState('');
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(['blog']);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const contentTypes = [
    { id: 'blog', label: 'Blog Posts', icon: '📝' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'script', label: 'Video Scripts', icon: '🎬' },
    { id: 'outline', label: 'Outlines', icon: '📋' },
    { id: 'thread', label: 'Threads', icon: '🧵' },
  ];

  const categories = ['Technology', 'Marketing', 'Business', 'Personal Development', 'Lifestyle'];

  const handleGenerateIdeas = async () => {
    if (!businessDescription.trim()) {
      addToast('Please describe your business or topic', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiService.generateIdeas(businessDescription, selectedContentTypes, 5);
      if (response.success && response.data) {
        setGeneratedIdeas(response.data);
        addToast(`Generated ${response.data.length} ideas!`, 'success');
      } else {
        addToast(response.error || 'Failed to generate ideas', 'error');
      }
    } catch (error) {
      addToast('Failed to generate ideas', 'error');
      console.error('Error generating ideas:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveIdea = (idea: Idea) => {
    if (!user) {
      addToast('Please log in to save ideas', 'error');
      return;
    }
    const newId = addIdea({
      userId: user.id,
      ...idea,
      isSaved: true,
      status: 'saved',
      createdAt: new Date().toISOString(),
    });
    setGeneratedIdeas(
      generatedIdeas.map(i => (i.id === idea.id ? { ...i, isSaved: true } : i))
    );
    addToast('Idea saved!', 'success');
  };

  const handleUseIdea = (idea: Idea) => {
    if (!user) {
      addToast('Please log in to use ideas', 'error');
      return;
    }
    // Save the idea first, then navigate to builder
    handleSaveIdea(idea);
    navigate(`/builder?topic=${encodeURIComponent(idea.title)}&description=${encodeURIComponent(idea.description)}`);
  };

  const handleStartWriting = (ideaId: string) => {
    if (!user) {
      addToast('Please log in to start writing', 'error');
      return;
    }
    navigate(`/builder?ideaId=${ideaId}`);
  };

  const handleDeleteIdea = (ideaId: string) => {
    deleteIdea(ideaId);
    setGeneratedIdeas(generatedIdeas.filter(i => i.id !== ideaId));
    addToast('Idea deleted', 'success');
  };

  const savedIdeas = getSavedIdeas();

  const generateSection = (
    <div className="space-y-3xl">
      {/* Input Section */}
      <Card className="border-2 border-brand/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-md">
            <Sparkles className="w-5 h-5 text-brand" />
            Describe Your Business or Topic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-lg">
          <Textarea
            label="What is your business, product, or topic about?"
            placeholder="e.g., I run a SaaS company focused on AI-powered content creation for marketing teams..."
            value={businessDescription}
            onChange={e => setBusinessDescription(e.target.value)}
            rows={5}
          />

          <div>
            <label className="block body-small font-semibold mb-md text-primary">Content Types</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-md">
              {contentTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() =>
                    setSelectedContentTypes(
                      selectedContentTypes.includes(type.id)
                        ? selectedContentTypes.filter(t => t !== type.id)
                        : [...selectedContentTypes, type.id]
                    )
                  }
                  className={`p-md rounded-lg border-2 transition-all ${
                    selectedContentTypes.includes(type.id)
                      ? 'border-brand bg-brand/10'
                      : 'border-primary hover:border-brand/50'
                  }`}
                >
                  <div className="text-2xl mb-sm">{type.icon}</div>
                  <p className="text-xs font-semibold text-primary">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            loading={isGenerating}
            onClick={handleGenerateIdeas}
          >
            <Sparkles className="w-5 h-5" />
            Generate Ideas
          </Button>
        </CardContent>
      </Card>

      {/* Generated Ideas */}
      {generatedIdeas.length > 0 && (
        <section>
          <h2 className="heading-3 mb-lg">Generated Ideas ({generatedIdeas.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {generatedIdeas.map(idea => (
              <Card key={idea.id} variant="default">
                <div className="flex items-start justify-between mb-lg">
                  <div className="w-8 h-8 bg-brand/20 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-brand" />
                  </div>
                  <div className="flex gap-md">
                    <button
                      onClick={() => handleSaveIdea(idea)}
                      className={`p-md rounded-lg transition-colors ${
                        idea.isSaved
                          ? 'bg-success/20 text-success'
                          : 'hover:bg-secondary text-secondary'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="p-md hover:bg-secondary rounded-lg transition-colors text-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="heading-4 mb-md text-primary">{idea.title}</h3>
                <p className="body-small text-secondary mb-lg line-clamp-2">{idea.description}</p>

                <div className="flex flex-wrap gap-md mb-lg">
                  <span className="badge badge-info">{idea.category}</span>
                  <span className="badge badge-primary">{idea.suggestedType}</span>
                </div>

                <div className="flex items-center gap-sm flex-wrap mb-lg">
                  {idea.suggestedPlatforms.map(platform => (
                    <span key={platform} className="badge badge-success text-xs">
                      {platform}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleUseIdea(idea)}
                  className="text-brand hover:text-primary-hover font-semibold text-sm flex items-center gap-sm w-full group"
                >
                  Use Idea
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const savedSection = (
    <div className="space-y-lg">
      <h2 className="heading-3 mb-lg">Saved Ideas ({savedIdeas.length})</h2>

      {savedIdeas.length === 0 ? (
        <Card className="text-center py-xl">
          <Bookmark className="w-12 h-12 text-secondary mx-auto mb-lg opacity-50" />
          <p className="body-base text-secondary mb-lg">No saved ideas yet</p>
          <p className="body-small text-secondary mb-lg">Generate ideas and save your favorites here</p>
          <Button variant="primary" onClick={() => setActiveTab('generate')}>
            Generate Ideas
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {savedIdeas.map(idea => {
            const ideaData = ideas.find(i => i.id === idea.id);
            return (
              <Card key={idea.id} variant="default">
                <div className="flex items-start justify-between mb-lg">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <Bookmark className="w-4 h-4 text-success" />
                  </div>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="p-md hover:bg-secondary rounded-lg transition-colors text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="heading-4 mb-md text-primary">{idea.title}</h3>
                <p className="body-small text-secondary mb-lg line-clamp-2">{idea.description}</p>

                <div className="flex items-center gap-sm flex-wrap mb-lg">
                  <span className="badge badge-primary">{idea.suggestedType}</span>
                </div>

                <button
                  onClick={() => handleStartWriting(idea.id)}
                  className="btn btn-primary w-full"
                >
                  Start Writing
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        {/* Header */}
        <div className="border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-md mb-md">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-inverse" />
              </div>
              <div>
                <h1 className="heading-2">Ideas Generator</h1>
                <p className="body-small text-secondary">Generate AI-powered content ideas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-xl py-3xl">
          {/* Tabs */}
          <div className="flex gap-lg mb-3xl border-b border-primary">
            {[
              { id: 'generate', label: 'Generate', count: generatedIdeas.length },
              { id: 'saved', label: 'Saved', count: savedIdeas.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-lg px-lg border-b-2 transition-colors flex items-center gap-md whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand text-brand font-semibold'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
                {tab.count > 0 && <span className="badge badge-primary">{tab.count}</span>}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'generate' && generateSection}
          {activeTab === 'saved' && savedSection}
        </div>
      </div>
    </MainLayout>
  );
}
