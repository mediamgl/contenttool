/**
 * @krisspy-file
 * @type page
 * @name "Publisher"
 * @title "Publisher"
 * @description "Publish and manage content across multiple platforms"
 * @routes ["/publisher"]
 * @requiresAuth false
 */

import React, { useState } from 'react';
import { Share2, Plug, CheckCircle } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

const PLATFORMS = [
  { id: 'medium', name: 'Medium', icon: '📱', color: 'from-brand to-primary-light', connected: false },
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'from-secondary to-brand', connected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-accent to-secondary-brand', connected: false },
  { id: 'bluesky', name: 'BlueSky', icon: '🦋', color: 'from-brand to-accent', connected: false },
  { id: 'substack', name: 'Substack', icon: '📧', color: 'from-secondary-brand to-brand', connected: false },
];

export default function Publisher() {
  const { addToast } = useToast();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  const handleConnect = (platformId: string) => {
    if (connectedPlatforms.includes(platformId)) {
      setConnectedPlatforms(connectedPlatforms.filter(id => id !== platformId));
      addToast('Platform disconnected', 'info');
    } else {
      setConnectedPlatforms([...connectedPlatforms, platformId]);
      addToast('Platform connected!', 'success');
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
            <h2 className="heading-3 mb-lg">Recent Posts</h2>
            <Card className="text-center py-xl">
              <Share2 className="w-12 h-12 mx-auto text-secondary opacity-50 mb-lg" />
              <p className="body-base text-secondary mb-lg">No published posts yet</p>
              <p className="body-small text-secondary">Publish your content to see it here</p>
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
