/**
 * @krisspy-file
 * @type page
 * @name "Publisher"
 * @title "Publisher"
 * @description "Publish and manage content across multiple platforms"
 * @routes ["/publisher"]
 * @requiresAuth false
 */

import React, { useState, useEffect } from 'react';
import { Share2, Plug, CheckCircle, Loader } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { useToast } from '../components/ui/Toast';
import { publishingService } from '../services/publishingService';

const PLATFORMS = [
  { id: 'medium', name: 'Medium', icon: '📱', color: 'from-brand to-primary-light', connected: false },
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'from-secondary to-brand', connected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-accent to-secondary-brand', connected: false },
  { id: 'bluesky', name: 'BlueSky', icon: '🦋', color: 'from-brand to-accent', connected: false },
  { id: 'substack', name: 'Substack', icon: '📧', color: 'from-secondary-brand to-brand', connected: false },
];

export default function Publisher() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { content } = useContent();
  const [searchParams] = useSearchParams();

  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [publishedContent, setPublishedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Load connections and published content on mount
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Handle pre-selected content from URL
  useEffect(() => {
    const contentId = searchParams.get('contentId');
    if (contentId) {
      setSelectedContent(contentId);
      setShowPublishModal(true);
    }
  }, [searchParams]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [connectionsResponse, publishedResponse] = await Promise.all([
        publishingService.getConnections(user.id),
        publishingService.getPublishedContent(user.id)
      ]);

      if (connectionsResponse.success && connectionsResponse.data) {
        setConnectedPlatforms(connectionsResponse.data.map((c: any) => c.platform));
      }

      if (publishedResponse.success && publishedResponse.data) {
        setPublishedContent(publishedResponse.data);
      }
    } catch (error) {
      console.error('Error loading publishing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platformId: string) => {
    if (!user) {
      addToast('Please log in to connect platforms', 'error');
      return;
    }

    if (connectedPlatforms.includes(platformId)) {
      // Disconnect
      const response = await publishingService.disconnectPlatform(platformId, user.id);
      if (response.success) {
        setConnectedPlatforms(connectedPlatforms.filter(id => id !== platformId));
        addToast('Platform disconnected', 'info');
      } else {
        addToast(response.error || 'Failed to disconnect', 'error');
      }
    } else {
      // Connect - in a real app, this would open OAuth flow
      // For now, we'll simulate it
      const response = await publishingService.connectPlatform(
        platformId,
        { mock: 'credentials' },
        user.id
      );
      if (response.success) {
        setConnectedPlatforms([...connectedPlatforms, platformId]);
        addToast('Platform connected!', 'success');
      } else {
        addToast(response.error || 'Failed to connect', 'error');
      }
    }
  };

  const handlePublish = async () => {
    if (!user || !selectedContent) {
      addToast('Please select content to publish', 'error');
      return;
    }

    if (selectedPlatforms.length === 0) {
      addToast('Please select at least one platform', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const response = await publishingService.publishContent(
        selectedContent,
        selectedPlatforms,
        user.id
      );

      if (response.success) {
        addToast('Content published successfully!', 'success');
        setShowPublishModal(false);
        setSelectedContent('');
        setSelectedPlatforms([]);
        loadData();
      } else {
        addToast(response.error || 'Failed to publish', 'error');
      }
    } catch (error) {
      addToast('Failed to publish', 'error');
      console.error('Error publishing content:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const togglePlatformSelection = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        <div className="border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto flex items-center gap-md mb-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6 text-inverse" />
            </div>
            <div>
              <h1 className="heading-2">Publisher</h1>
              <p className="body-small text-secondary">Publish content to your platforms</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-xl py-3xl">
          {/* Publish Button */}
          <div className="flex justify-end mb-lg">
            <Button
              variant="primary"
              onClick={() => setShowPublishModal(true)}
              disabled={content.length === 0 || connectedPlatforms.length === 0}
            >
              <Share2 className="w-4 h-4" />
              Publish Content
            </Button>
          </div>

          {/* Connected Platforms */}
          <section className="mb-3xl">
            <h2 className="heading-3 mb-lg">Connected Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-lg">
              {PLATFORMS.map(platform => (
                <Card key={platform.id} variant="default">
                  <div className="text-center space-y-lg">
                    <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} rounded-lg mx-auto flex items-center justify-center text-3xl`}>
                      {platform.icon}
                    </div>
                    <h3 className="heading-4">{platform.name}</h3>

                    {connectedPlatforms.includes(platform.id) ? (
                      <div className="flex items-center justify-center gap-md text-success">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Connected</span>
                      </div>
                    ) : (
                      <p className="body-small text-secondary">Not connected</p>
                    )}

                    <Button
                      variant={connectedPlatforms.includes(platform.id) ? 'secondary' : 'primary'}
                      className="w-full"
                      onClick={() => handleConnect(platform.id)}
                    >
                      {connectedPlatforms.includes(platform.id) ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Posts */}
          <section>
            <h2 className="heading-3 mb-lg">Recently Published</h2>
            {isLoading ? (
              <Card className="text-center py-xl">
                <Loader className="w-12 h-12 mx-auto text-brand opacity-50 mb-lg animate-spin" />
                <p className="body-base text-secondary">Loading...</p>
              </Card>
            ) : publishedContent.length === 0 ? (
              <Card className="text-center py-xl">
                <Share2 className="w-12 h-12 mx-auto text-secondary opacity-50 mb-lg" />
                <p className="body-base text-secondary mb-lg">No published posts yet</p>
                <p className="body-small text-secondary">Publish your content to see it here</p>
              </Card>
            ) : (
              <div className="space-y-md">
                {publishedContent.map((item: any) => {
                  const contentItem = content.find(c => c.id === item.content_id);
                  return (
                    <Card key={item.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="heading-4 mb-md">{contentItem?.title || 'Content'}</h3>
                          <div className="flex items-center gap-md flex-wrap">
                            <span className="badge badge-success">{item.platform}</span>
                            <span className="badge badge-info">{item.status}</span>
                            <span className="caption text-secondary">
                              {new Date(item.published_at).toLocaleDateString()}
                            </span>
                          </div>
                          {item.external_url && (
                            <a
                              href={item.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand hover:underline text-sm mt-md inline-block"
                            >
                              View on {item.platform} →
                            </a>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Publish Modal */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish Content"
        size="md"
      >
        <div className="space-y-lg">
          <Select
            label="Select Content"
            value={selectedContent}
            onChange={e => setSelectedContent(e.target.value)}
            options={[
              { value: '', label: 'Choose content to publish...' },
              ...content.map(c => ({ value: c.id, label: c.title }))
            ]}
          />

          <div>
            <label className="block body-small font-semibold mb-md text-primary">
              Select Platforms
            </label>
            <div className="space-y-md">
              {PLATFORMS.filter(p => connectedPlatforms.includes(p.id)).map(platform => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatformSelection(platform.id)}
                  className={`w-full p-md rounded-lg border-2 transition-all text-left flex items-center gap-md ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-brand bg-brand/10'
                      : 'border-primary hover:border-brand/50'
                  }`}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="font-semibold text-primary">{platform.name}</span>
                  {selectedPlatforms.includes(platform.id) && (
                    <CheckCircle className="w-5 h-5 text-brand ml-auto" />
                  )}
                </button>
              ))}
            </div>
            {connectedPlatforms.length === 0 && (
              <p className="body-small text-secondary mt-md">
                Connect at least one platform to publish content
              </p>
            )}
          </div>

          <div className="flex gap-md">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowPublishModal(false)}
              disabled={isPublishing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handlePublish}
              loading={isPublishing}
              disabled={!selectedContent || selectedPlatforms.length === 0}
            >
              Publish
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
