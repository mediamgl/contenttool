/**
 * @krisspy-file
 * @type page
 * @name "ContentBuilder"
 * @title "Content Builder"
 * @description "Multi-step content builder for creating outlines and drafts"
 * @routes ["/builder"]
 * @requiresAuth false
 */

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { aiService } from '../services/aiService';

type Step = 'topic' | 'hooks' | 'outline' | 'complete';

interface BuilderState {
  step: Step;
  topic: string;
  contentType: string;
  hooks: string[];
  selectedHook: string;
  outline: any;
  isLoading: boolean;
}

export default function ContentBuilder() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { addOutline, ideas } = useContent();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<BuilderState>({
    step: 'topic',
    topic: '',
    contentType: 'blog',
    hooks: [],
    selectedHook: '',
    outline: null,
    isLoading: false,
  });

  // Handle URL parameters for pre-filling from ideas
  useEffect(() => {
    const topicParam = searchParams.get('topic');
    const descriptionParam = searchParams.get('description');
    const ideaIdParam = searchParams.get('ideaId');

    if (topicParam) {
      setState(prev => ({ ...prev, topic: topicParam }));
    }

    if (ideaIdParam) {
      const idea = ideas.find(i => i.id === ideaIdParam);
      if (idea) {
        setState(prev => ({ ...prev, topic: idea.title }));
      }
    }
  }, [searchParams, ideas]);

  const handleTopicSubmit = async () => {
    if (!state.topic.trim()) {
      addToast('Please enter a topic or title', 'error');
      return;
    }

    if (!user) {
      addToast('Please log in to continue', 'error');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await aiService.generateHooks(state.topic, 5);
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          hooks: response.data!,
          step: 'hooks',
          isLoading: false,
        }));
      } else {
        addToast(response.error || 'Failed to generate hooks', 'error');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      addToast('Failed to generate hooks', 'error');
      console.error('Error generating hooks:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleHookSelect = async () => {
    if (!state.selectedHook) {
      addToast('Please select a hook', 'error');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await aiService.generateOutline(state.topic, state.selectedHook);
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          outline: response.data,
          step: 'outline',
          isLoading: false,
        }));
      } else {
        addToast(response.error || 'Failed to generate outline', 'error');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      addToast('Failed to generate outline', 'error');
      console.error('Error generating outline:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleOutlineUpdate = (updates: any) => {
    setState(prev => ({
      ...prev,
      outline: { ...prev.outline, ...updates },
    }));
  };

  const handleCreateContent = () => {
    if (!state.outline) {
      addToast('No outline found', 'error');
      return;
    }

    if (!user) {
      addToast('Please log in to continue', 'error');
      return;
    }

    const outlineId = addOutline({
      userId: user.id,
      title: state.topic,
      topic: state.topic,
      hook: state.selectedHook,
      hookAlternatives: state.hooks.filter(h => h !== state.selectedHook),
      sections: state.outline.sections || [],
      cta: state.outline.cta || '',
      contentType: state.contentType as any,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    addToast('Content outline created!', 'success');
    // Store the outline ID for navigation
    setState(prev => ({
      ...prev,
      step: 'complete',
      isLoading: false,
      outline: { ...prev.outline, id: outlineId },
    }));
  };

  // Step 1: Topic Input
  if (state.step === 'topic') {
    return (
      <MainLayout>
        <div className="min-h-screen bg-primary flex items-center justify-center px-lg py-3xl">
          <div className="max-w-2xl w-full">
            <Card className="border-2 border-brand/30">
              <CardHeader>
                <div className="flex items-center gap-md mb-md">
                  <div className="w-12 h-12 bg-brand rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-inverse" />
                  </div>
                  <div>
                    <CardTitle>Create New Content</CardTitle>
                    <p className="body-small text-secondary mt-sm">Step 1 of 3: Choose your topic</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-lg">
                <Input
                  label="Content Title or Topic"
                  placeholder="e.g., How to master remote work productivity"
                  value={state.topic}
                  onChange={e => setState(prev => ({ ...prev, topic: e.target.value }))}
                />

                <Select
                  label="Content Type"
                  options={[
                    { value: 'blog', label: 'Blog Post' },
                    { value: 'social', label: 'Social Media' },
                    { value: 'script', label: 'Video Script' },
                    { value: 'outline', label: 'Outline' },
                  ]}
                  value={state.contentType}
                  onChange={e => setState(prev => ({ ...prev, contentType: e.target.value }))}
                />

                <div className="flex gap-md">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => (window.location.href = '/ideas')}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    loading={state.isLoading}
                    onClick={handleTopicSubmit}
                  >
                    Generate Hooks <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Step 2: Hook Selection
  if (state.step === 'hooks') {
    return (
      <MainLayout>
        <div className="min-h-screen bg-primary px-lg py-3xl">
          <div className="max-w-4xl mx-auto">
            <div className="mb-xl">
              <h1 className="heading-2 mb-md">Select Your Hook</h1>
              <p className="body-base text-secondary">Step 2 of 3: Choose the best opening for your content</p>
            </div>

            <div className="space-y-lg">
              {state.hooks.map((hook, idx) => (
                <Card
                  key={idx}
                  variant="interactive"
                  onClick={() => setState(prev => ({ ...prev, selectedHook: hook }))}
                  className={`cursor-pointer transition-all ${
                    state.selectedHook === hook ? 'border-2 border-brand bg-brand/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
                        state.selectedHook === hook
                          ? 'bg-brand text-inverse'
                          : 'bg-secondary text-secondary'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="body-base text-primary">{hook}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-md mt-xl">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setState(prev => ({ ...prev, step: 'topic', hooks: [] }))}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                loading={state.isLoading}
                onClick={handleHookSelect}
              >
                Generate Outline <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Step 3: Outline Review
  if (state.step === 'outline' && state.outline) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-primary px-lg py-3xl">
          <div className="max-w-4xl mx-auto">
            <div className="mb-xl">
              <h1 className="heading-2 mb-md">Review Your Outline</h1>
              <p className="body-base text-secondary">Step 3 of 3: Customize sections and prepare to write</p>
            </div>

            <div className="space-y-lg">
              {/* Hook Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Opening Hook</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="body-base text-primary">{state.outline.hook}</p>
                </CardContent>
              </Card>

              {/* Sections */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Sections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-lg">
                  {state.outline.sections?.map((section: any, idx: number) => (
                    <div key={idx} className="p-lg bg-secondary rounded-lg border border-primary">
                      <div className="flex items-start gap-md mb-md">
                        <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-inverse font-semibold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            className="input bg-primary text-sm font-semibold"
                            value={section.heading}
                            onChange={e => {
                              const newSections = [...state.outline.sections];
                              newSections[idx].heading = e.target.value;
                              handleOutlineUpdate({ sections: newSections });
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-md">
                        {section.keyPoints?.map((point: string, pIdx: number) => (
                          <div key={pIdx} className="flex items-start gap-md ml-12">
                            <span className="text-secondary mt-1">•</span>
                            <input
                              type="text"
                              className="input bg-primary text-sm"
                              value={point}
                              onChange={e => {
                                const newSections = [...state.outline.sections];
                                newSections[idx].keyPoints[pIdx] = e.target.value;
                                handleOutlineUpdate({ sections: newSections });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Call to Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="text"
                    className="input bg-primary"
                    value={state.outline.cta}
                    onChange={e => handleOutlineUpdate({ cta: e.target.value })}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-md mt-xl">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setState(prev => ({ ...prev, step: 'hooks' }))}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                loading={state.isLoading}
                onClick={handleCreateContent}
              >
                <BookOpen className="w-4 h-4" />
                Create Content
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Step 4: Complete
  if (state.step === 'complete') {
    return (
      <MainLayout>
        <div className="min-h-screen bg-primary flex items-center justify-center px-lg py-3xl">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-lg">
              <Sparkles className="w-8 h-8 text-inverse" />
            </div>
            <h1 className="heading-2 mb-md">Content Outline Created!</h1>
            <p className="body-base text-secondary mb-xl">
              Your content outline is ready. Now let's write the full draft.
            </p>
            <div className="flex flex-col gap-md">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate(`/editor?outlineId=${state.outline?.id || ''}`)}
              >
                Start Writing
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/library')}
              >
                View in Library
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return null;
}
