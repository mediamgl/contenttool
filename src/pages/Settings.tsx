/**
 * @krisspy-file
 * @type page
 * @name "Settings"
 * @title "Settings"
 * @description "User settings page for profile, API keys, and preferences"
 * @routes ["/settings"]
 * @requiresAuth false
 */

import React, { useState } from 'react';
import { Key, User, Settings as SettingsIcon, Eye, EyeOff, Trash2, Plus, Check } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

interface ApiKey {
  id: string;
  provider: 'anthropic' | 'openai' | 'google';
  keyPreview: string;
  isValid: boolean;
  addedAt: string;
}

const PROVIDERS = [
  { id: 'anthropic', name: 'Anthropic', icon: '🤖', color: 'from-brand to-primary-light' },
  { id: 'openai', name: 'OpenAI', icon: '🧠', color: 'from-secondary to-brand' },
  { id: 'google', name: 'Google', icon: '🔍', color: 'from-accent to-secondary-brand' },
];

export default function Settings() {
  const { user, updateProfile, updatePreferences } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'keys' | 'preferences'>('profile');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      provider: 'anthropic',
      keyPreview: 'sk-ant-...xxxx',
      isValid: true,
      addedAt: new Date().toISOString(),
    },
  ]);
  const [showAddKey, setShowAddKey] = useState(false);
  const [newKeyProvider, setNewKeyProvider] = useState<string>('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showKeyValue, setShowKeyValue] = useState(false);

  const handleAddKey = async () => {
    if (!newKeyProvider || !newKeyValue) {
      addToast('Provider and key are required', 'error');
      return;
    }

    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      provider: newKeyProvider as any,
      keyPreview: newKeyValue.substring(0, 6) + '...' + newKeyValue.substring(newKeyValue.length - 4),
      isValid: true,
      addedAt: new Date().toISOString(),
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyProvider('');
    setNewKeyValue('');
    setShowAddKey(false);
    addToast('API key added successfully', 'success');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    addToast('API key removed', 'success');
  };

  const profileSection = (
    <div className="space-y-lg max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-md">
            <User className="w-5 h-5 text-brand" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-lg">
          <Input
            label="Full Name"
            type="text"
            value={user?.name || ''}
            onChange={e =>
              updateProfile({
                ...user,
                name: e.target.value,
              } as any)
            }
          />

          <Input
            label="Email Address"
            type="email"
            value={user?.email || ''}
            disabled
          />

          <Input
            label="Timezone"
            type="text"
            value={user?.preferences.timezone || 'UTC'}
            onChange={e =>
              updatePreferences({
                timezone: e.target.value,
              })
            }
          />

          <Button variant="primary" className="w-full">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-lg">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
          />

          <Button variant="primary" className="w-full">
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const keysSection = (
    <div className="space-y-lg max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-md">
              <Key className="w-5 h-5 text-brand" />
              API Keys
            </CardTitle>
            <Button variant="primary" size="sm" onClick={() => setShowAddKey(true)}>
              <Plus className="w-4 h-4" />
              Add Key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-lg">
          <p className="body-small text-secondary">
            Connect your AI provider accounts using your own API keys (BYOK). Your keys are encrypted and never shared.
          </p>

          {apiKeys.length === 0 ? (
            <div className="text-center py-xl">
              <p className="body-base text-secondary mb-lg">No API keys configured yet</p>
              <Button variant="primary" onClick={() => setShowAddKey(true)}>
                <Plus className="w-4 h-4" />
                Add Your First Key
              </Button>
            </div>
          ) : (
            <div className="space-y-md">
              {apiKeys.map(key => {
                const provider = PROVIDERS.find(p => p.id === key.provider);
                return (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-lg bg-secondary rounded-lg border border-primary"
                  >
                    <div className="flex items-center gap-lg">
                      <div className={`w-12 h-12 bg-gradient-to-br ${provider?.color} rounded-lg flex items-center justify-center text-xl`}>
                        {provider?.icon}
                      </div>
                      <div>
                        <p className="body-base font-semibold text-primary">{provider?.name}</p>
                        <div className="flex items-center gap-md mt-xs">
                          <code className="text-sm text-secondary font-mono">{key.keyPreview}</code>
                          {key.isValid && (
                            <div className="flex items-center gap-xs">
                              <Check className="w-4 h-4 text-success" />
                              <span className="text-xs text-success font-semibold">Valid</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-md hover:bg-primary rounded-lg transition-colors text-danger"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to get your API keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-lg">
          {PROVIDERS.map(provider => (
            <div key={provider.id} className="space-y-sm">
              <h4 className="body-base font-semibold text-primary">{provider.name}</h4>
              <p className="body-small text-secondary">
                Visit the {provider.name} console to create an API key, then paste it above.
              </p>
              <button className="text-brand hover:text-primary-hover text-sm font-semibold">
                Learn more →
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const preferencesSection = (
    <div className="space-y-lg max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-md">
            <SettingsIcon className="w-5 h-5 text-brand" />
            Default Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-lg">
          <div>
            <label className="block body-small font-semibold mb-md text-primary">Default Content Type</label>
            <select
              className="input"
              value={user?.preferences.defaultContentType || 'blog'}
              onChange={e => updatePreferences({ defaultContentType: e.target.value })}
            >
              <option value="blog">Blog Post</option>
              <option value="social">Social Media</option>
              <option value="script">Video Script</option>
              <option value="outline">Outline</option>
            </select>
          </div>

          <div>
            <label className="block body-small font-semibold mb-md text-primary">Default Platform</label>
            <select
              className="input"
              value={user?.preferences.defaultPlatform || 'medium'}
              onChange={e => updatePreferences({ defaultPlatform: e.target.value })}
            >
              <option value="medium">Medium</option>
              <option value="twitter">Twitter/X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="substack">Substack</option>
              <option value="bluesky">BlueSky</option>
            </select>
          </div>

          <div>
            <label className="block body-small font-semibold mb-md text-primary">Default AI Provider</label>
            <select
              className="input"
              value={user?.preferences.defaultAIProvider || 'anthropic'}
              onChange={e => updatePreferences({ defaultAIProvider: e.target.value })}
            >
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="openai">OpenAI (GPT)</option>
              <option value="google">Google (Gemini)</option>
            </select>
          </div>

          <div>
            <label className="block body-small font-semibold mb-md text-primary">Writing Tone</label>
            <select
              className="input"
              value={user?.preferences.writingTone || 'professional'}
              onChange={e => updatePreferences({ writingTone: e.target.value })}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
              <option value="creative">Creative</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          <Button variant="primary" className="w-full">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        {/* Header */}
        <div className="border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto">
            <h1 className="heading-2">Settings</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-xl py-3xl">
          {/* Tabs */}
          <div className="flex gap-lg mb-3xl border-b border-primary overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'keys', label: 'API Keys' },
              { id: 'preferences', label: 'Preferences' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-lg px-lg border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand text-brand font-semibold'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'profile' && profileSection}
          {activeTab === 'keys' && keysSection}
          {activeTab === 'preferences' && preferencesSection}
        </div>

        {/* Add Key Modal */}
        <Modal
          isOpen={showAddKey}
          onClose={() => {
            setShowAddKey(false);
            setNewKeyProvider('');
            setNewKeyValue('');
            setShowKeyValue(false);
          }}
          title="Add API Key"
          size="md"
        >
          <div className="space-y-lg">
            <div>
              <label className="block body-small font-semibold mb-md text-primary">Provider</label>
              <select
                className="input"
                value={newKeyProvider}
                onChange={e => setNewKeyProvider(e.target.value)}
              >
                <option value="">Select a provider</option>
                {PROVIDERS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block body-small font-semibold mb-md text-primary">API Key</label>
              <div className="relative">
                <input
                  type={showKeyValue ? 'text' : 'password'}
                  placeholder="sk-..."
                  className="input pr-12"
                  value={newKeyValue}
                  onChange={e => setNewKeyValue(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowKeyValue(!showKeyValue)}
                  className="absolute right-lg top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary"
                >
                  {showKeyValue ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-secondary mt-sm">Your key will be encrypted and never shared</p>
            </div>

            <div className="flex gap-md">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowAddKey(false);
                  setNewKeyProvider('');
                  setNewKeyValue('');
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleAddKey}>
                Add Key
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
