/**
 * @krisspy-file
 * @type page
 * @name "Dashboard"
 * @title "Dashboard"
 * @description "Main dashboard showing user stats, recent activity, and quick actions"
 * @routes ["/"]
 * @requiresAuth false
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, FileText, BookOpen, Share2, TrendingUp, Calendar, ChevronRight, Plus } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { content, ideas, getContentByStatus } = useContent();
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    const drafts = getContentByStatus('draft');
    const published = getContentByStatus('published');
    const totalWords = content.reduce((sum, item) => sum + item.wordCount, 0);

    setStats([
      {
        label: 'Content Created',
        value: content.length,
        icon: <FileText className="w-6 h-6" />,
        color: 'text-brand',
      },
      {
        label: 'Published',
        value: published.length,
        icon: <Share2 className="w-6 h-6" />,
        color: 'text-success',
      },
      {
        label: 'In Drafts',
        value: drafts.length,
        icon: <BookOpen className="w-6 h-6" />,
        color: 'text-warning',
      },
      {
        label: 'Words Written',
        value: totalWords > 0 ? Math.round(totalWords / 100) + '00' : '0',
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'text-info',
      },
    ]);
  }, [content, getContentByStatus]);

  const recentContent = content.slice(-3).reverse();
  const suggestedTopics = [
    'The Future of AI in Content Creation',
    'How to Master Remote Work',
    'Building Personal Brands Online',
    'Productivity Tips for Creators',
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand/10 to-secondary-brand/10 border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto">
            <h1 className="heading-2 mb-md">
              Welcome back, <span className="text-brand">{user?.name || 'Creator'}</span>!
            </h1>
            <p className="body-base text-secondary">You're on your way to amazing content creation</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-xl py-3xl space-y-3xl">
          {/* Stats Grid */}
          <section>
            <h2 className="heading-3 mb-lg">This Week's Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
              {stats.map((stat, idx) => (
                <Card key={idx} variant="default">
                  <div className="flex items-start justify-between mb-md">
                    <div className={`${stat.color}`}>{stat.icon}</div>
                  </div>
                  <p className="caption text-secondary mb-xs">{stat.label}</p>
                  <p className="heading-3 text-brand">{stat.value}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="heading-3 mb-lg">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
              <Card variant="interactive">
                <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center mb-lg">
                  <Lightbulb className="w-6 h-6 text-brand" />
                </div>
                <h3 className="heading-4 mb-sm">Generate Ideas</h3>
                <p className="body-small text-secondary mb-lg">Get AI-powered content ideas instantly</p>
                <Link to="/ideas" className="text-brand hover:text-primary-hover font-semibold flex items-center gap-sm">
                  Start <ChevronRight className="w-4 h-4" />
                </Link>
              </Card>

              <Card variant="interactive">
                <div className="w-12 h-12 bg-secondary-brand/20 rounded-lg flex items-center justify-center mb-lg">
                  <FileText className="w-6 h-6 text-secondary-brand" />
                </div>
                <h3 className="heading-4 mb-sm">Write New</h3>
                <p className="body-small text-secondary mb-lg">Create a new piece of content</p>
                <Link to="/editor" className="text-brand hover:text-primary-hover font-semibold flex items-center gap-sm">
                  Write <ChevronRight className="w-4 h-4" />
                </Link>
              </Card>

              <Card variant="interactive">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-lg">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <h3 className="heading-4 mb-sm">View Library</h3>
                <p className="body-small text-secondary mb-lg">Browse all your content</p>
                <Link to="/library" className="text-brand hover:text-primary-hover font-semibold flex items-center gap-sm">
                  Explore <ChevronRight className="w-4 h-4" />
                </Link>
              </Card>

              <Card variant="interactive">
                <div className="w-12 h-12 bg-info/20 rounded-lg flex items-center justify-center mb-lg">
                  <Share2 className="w-6 h-6 text-info" />
                </div>
                <h3 className="heading-4 mb-sm">Publish</h3>
                <p className="body-small text-secondary mb-lg">Share content to platforms</p>
                <Link to="/publisher" className="text-brand hover:text-primary-hover font-semibold flex items-center gap-sm">
                  Publish <ChevronRight className="w-4 h-4" />
                </Link>
              </Card>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {/* Recent Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-lg">
                <h2 className="heading-3">Recent Content</h2>
                <Link to="/library" className="text-brand text-sm hover:text-primary-hover">
                  View all
                </Link>
              </div>

              {recentContent.length > 0 ? (
                <div className="space-y-md">
                  {recentContent.map(item => (
                    <Card key={item.id} variant="default">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="heading-4 mb-sm">{item.title}</h3>
                          <div className="flex items-center gap-lg flex-wrap">
                            <span className="badge badge-info">{item.contentType}</span>
                            <span className={`badge badge-${item.status === 'draft' ? 'warning' : item.status === 'published' ? 'success' : 'info'}`}>
                              {item.status}
                            </span>
                            <span className="caption text-secondary">{item.wordCount} words</span>
                          </div>
                        </div>
                        <Link
                          to={`/editor/${item.id}`}
                          className="btn btn-sm btn-ghost"
                        >
                          Edit
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card variant="default" className="text-center py-xl">
                  <p className="body-base text-secondary mb-lg">No content yet. Start by creating your first piece!</p>
                  <Link to="/editor" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    Create Content
                  </Link>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-lg">
              {/* Suggested Topics */}
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-md">
                  {suggestedTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left p-md hover:bg-secondary rounded-lg transition-colors group"
                    >
                      <p className="body-small text-primary group-hover:text-brand transition-colors font-medium">
                        {topic}
                      </p>
                    </button>
                  ))}
                  <Button variant="ghost" className="w-full">
                    <Lightbulb className="w-4 h-4" />
                    Generate More Ideas
                  </Button>
                </CardContent>
              </Card>

              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-sm">
                    <Calendar className="w-5 h-5 text-brand" />
                    Publishing Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-md">
                  <div className="grid grid-cols-7 gap-xs">
                    {Array.from({ length: 35 }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`aspect-square rounded-sm flex items-center justify-center text-xs ${
                          idx === 14 ? 'bg-brand text-inverse' : 'bg-secondary text-secondary'
                        }`}
                      >
                        {(idx % 7) + 1}
                      </div>
                    ))}
                  </div>
                  <p className="caption text-secondary text-center">No scheduled content</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
