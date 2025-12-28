/**
 * @krisspy-file
 * @type page
 * @name "Library"
 * @title "Content Library"
 * @description "Browse, search, and manage all content pieces"
 * @routes ["/library"]
 * @requiresAuth false
 */

import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Filter, Trash2, Edit, Share2, MoreVertical, Plus } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useContent } from '../context/ContentContext';
import { useToast } from '../components/ui/Toast';

type FilterType = 'all' | 'draft' | 'ready' | 'published';
type SortBy = 'recent' | 'oldest' | 'title' | 'words';

export default function Library() {
  const { content, deleteContent } = useContent();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');

  const filteredAndSorted = useMemo(() => {
    let result = content;

    // Filter
    if (filterType !== 'all') {
      result = result.filter(item => item.status === filterType);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'words':
        result.sort((a, b) => b.wordCount - a.wordCount);
        break;
    }

    return result;
  }, [content, searchQuery, filterType, sortBy]);

  const stats = {
    total: content.length,
    drafts: content.filter(c => c.status === 'draft').length,
    ready: content.filter(c => c.status === 'ready').length,
    published: content.filter(c => c.status === 'published').length,
    totalWords: content.reduce((sum, c) => sum + c.wordCount, 0),
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'badge-warning';
      case 'ready':
        return 'badge-info';
      case 'published':
        return 'badge-success';
      default:
        return 'badge-primary';
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      blog: '📝',
      social: '📱',
      script: '🎬',
      outline: '📋',
      thread: '🧵',
    };
    return icons[type] || '📄';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        {/* Header */}
        <div className="border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-inverse" />
                </div>
                <div>
                  <h1 className="heading-2">Content Library</h1>
                  <p className="body-small text-secondary">Manage all your content pieces</p>
                </div>
              </div>
              <Button variant="primary">
                <Plus className="w-4 h-4" />
                New Content
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-lg">
              {[
                { label: 'Total', value: stats.total },
                { label: 'Drafts', value: stats.drafts },
                { label: 'Ready', value: stats.ready },
                { label: 'Published', value: stats.published },
                { label: 'Words', value: stats.totalWords.toLocaleString() },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="heading-3 text-brand">{stat.value}</p>
                  <p className="caption text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-xl py-3xl">
          {/* Filters */}
          <div className="space-y-lg mb-3xl">
            <div className="flex gap-lg flex-wrap">
              <div className="flex-1 min-w-[250px]">
                <Input
                  placeholder="Search by title or tag..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              <select
                className="input"
                value={filterType}
                onChange={e => setFilterType(e.target.value as FilterType)}
              >
                <option value="all">All Items</option>
                <option value="draft">Drafts</option>
                <option value="ready">Ready</option>
                <option value="published">Published</option>
              </select>

              <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}>
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title (A-Z)</option>
                <option value="words">Word Count</option>
              </select>
            </div>
          </div>

          {/* Content List */}
          {filteredAndSorted.length === 0 ? (
            <Card className="text-center py-xl">
              <BookOpen className="w-12 h-12 mx-auto text-secondary opacity-50 mb-lg" />
              <p className="body-base text-secondary mb-lg">No content found</p>
              <p className="body-small text-secondary mb-lg">
                {searchQuery ? 'Try adjusting your search' : 'Create your first piece of content'}
              </p>
              <Button variant="primary">Get Started</Button>
            </Card>
          ) : (
            <div className="space-y-md">
              {filteredAndSorted.map(item => (
                <Card key={item.id} variant="default">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-md mb-md">
                        <span className="text-2xl">{getTypeIcon(item.contentType)}</span>
                        <div className="flex-1">
                          <h3 className="heading-4 text-primary">{item.title}</h3>
                          <p className="body-small text-secondary">
                            {new Date(item.updatedAt).toLocaleDateString()} • {item.wordCount} words
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-md flex-wrap">
                        <span className={`badge ${getStatusBadgeColor(item.status)}`}>{item.status}</span>
                        <span className="badge badge-info">{item.contentType}</span>
                        {item.tags.map(tag => (
                          <span key={tag} className="badge badge-primary text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-md">
                      <button
                        className="p-md hover:bg-secondary rounded-lg transition-colors text-brand"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        className="p-md hover:bg-secondary rounded-lg transition-colors text-brand"
                        title="Share"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          deleteContent(item.id);
                          addToast('Content deleted', 'success');
                        }}
                        className="p-md hover:bg-secondary rounded-lg transition-colors text-danger"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
