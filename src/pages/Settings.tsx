/**
 * @krisspy-file
 * @type page
 * @name "Settings"
 * @title "Settings"
 * @description "User settings page for profile, API keys, and preferences"
 * @routes ["/settings"]
 * @requiresAuth false
 */

import React, { useState, useEffect } from 'react';
import { Key, User, Settings as SettingsIcon, Eye, EyeOff, Trash2, Plus, Check, AlertCircle } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { apiKeyService } from '../services/apiKeyService';

interface ApiKey {
  id: string;
  provider: 'anthropic' | 'openai' | 'google';
  keyName: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
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
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [showAddKey, setShowAddKey] = useState(false);
  const [newKeyProvider, setNewKeyProvider] = useState<string>('');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showKeyValue, setShowKeyValue] = useState(false);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    setIsLoadingKeys(true);
    const result = await apiKeyService.getApiKeys();
    if (result.success && result.data) {
      setApiKeys(result.data);
    } else {
      addToast(result.error || 'Failed to load API keys', 'error');
    }
    setIsLoadingKeys(false);
  };

  const handleAddKey = async () => {
    if (!newKeyProvider || !newKeyValue || !newKeyName) {
      addToast('Provider, name, and key are required', 'error');
      return;
    }

    const result = await apiKeyService.saveApiKey(
      newKeyProvider as any,
      newKeyName,
      newKeyValue
    );

    if (result.success) {
      await loadApiKeys();
      setNewKeyProvider('');
      setNewKeyName('');
      setNewKeyValue('');
      setShowAddKey(false);
      addToast('API key added successfully', 'success');
    } else {
      addToast(result.error || 'Failed to add API key', 'error');
    }
  };

  const handleDeleteKey = async (id: string) => {
    const result = await apiKeyService.deleteApiKey(id);
    if (result.success) {
      await loadApiKeys();
      addToast('API key removed', 'success');
    } else {
      addToast(result.error || 'Failed to delete API key', 'error');
    }
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
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="flex items-start gap-md py-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-xs" />
          <div className="space-y-sm">
            <p className="body-small font-semibold text-blue-900 dark:text-blue-100">
              Note: User API keys are not yet integrated with AI features
            </p>
            <p className="body-small text-blue-800 dark:text-blue-200">
              Currently, all AI features use the global ANTHROPIC_API_KEY configured in Supabase Edge Function Secrets.
              The ability to use your own API keys (BYOK) is planned for a future update. For now, you can store keys here for reference.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-md">
              <Key className="w-5 h-5 text-brand" />
              API Keys (BYOK)
            </CardTitle>
            <Button variant="primary" size="sm" onClick={() => setShowAddKey(true)}>
              <Plus className="w-4 h-4" />
              Add Key
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-lg">
          <p className="body-small text-secondary">
            Store your AI provider API keys securely. Your keys are encrypted and stored in the database.
          </p>

          {isLoadingKeys ? (
            <div className="text-center py-xl">
              <div className="inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
              <p className="body-small text-secondary mt-md">Loading your API keys...</p>
            </div>
          ) : apiKeys.length === 0 ? (
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
                        <p className="body-small text-secondary">{key.keyName}</p>
                        <div className="flex items-center gap-md mt-xs">
                          {key.isActive && (
                            <div className="flex items-center gap-xs">
                              <Check className="w-4 h-4 text-success" />
                              <span className="text-xs text-success font-semibold">Active</span>
                            </div>
                          )}
                          <span className="text-xs text-tertiary">
                            Added {new Date(key.createdAt).toLocaleDateString()}
                          </span>
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
            setNewKeyName('');
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

            <div>
              <label className="block body-small font-semibold mb-md text-primary">Key Name</label>
              <input
                type="text"
                placeholder="My Production Key"
                className="input"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
              />
              <p className="text-xs text-secondary mt-sm">A friendly name to identify this key</p>
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
              <p className="text-xs text-secondary mt-sm">Your key will be encrypted and stored securely</p>
            </div>

            <div className="flex gap-md">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowAddKey(false);
                  setNewKeyProvider('');
                  setNewKeyName('');
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
