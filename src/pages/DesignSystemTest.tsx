/**
 * @krisspy-file
 * @type page
 * @name "DesignSystemTest"
 * @title "Design System Test"
 * @description "ContentFlow design system showcase with brand colors and components"
 * @routes ["/design-system"]
 * @design "template"
 * @requiresAuth false
 */

import { FileText, Pen, Send, Star, Zap, Check, AlertCircle, Info, XCircle, Sparkles, BookOpen, Layout } from 'lucide-react';
import { useState } from 'react';

export default function DesignSystemTest() {
  const [activeSection, setActiveSection] = useState<string>('colors');

  const tabs = [
    { id: 'colors', label: 'Colors', icon: Sparkles },
    { id: 'typography', label: 'Typography', icon: FileText },
    { id: 'buttons', label: 'Buttons', icon: Layout },
    { id: 'cards', label: 'Cards', icon: BookOpen },
    { id: 'forms', label: 'Forms', icon: Pen },
    { id: 'components', label: 'Components', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-primary text-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary/95 backdrop-blur-md border-b border-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-xl py-lg flex items-center justify-between">
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center shadow-md">
              <FileText className="w-6 h-6 text-inverse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">ContentFlow</h1>
              <p className="text-secondary text-sm">Design System</p>
            </div>
          </div>
          <div className="px-lg py-sm bg-gradient-to-r from-brand/10 to-secondary-brand/10 rounded-full border border-brand/20">
            <span className="text-sm font-medium text-brand">v1.0</span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-primary border-b border-primary sticky top-[89px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-xl flex gap-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-lg px-lg border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-sm ${
                  activeSection === tab.id
                    ? 'border-brand text-brand font-semibold'
                    : 'border-transparent text-secondary hover:text-primary hover:bg-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-xl py-3xl">
        {/* Colors Section */}
        {activeSection === 'colors' && (
          <section className="space-y-3xl animate-fade-in">
            <div>
              <h2 className="heading-2 mb-md">Color System</h2>
              <p className="body-base text-secondary mb-xl">ContentFlow brand colors and semantic palette</p>
            </div>

            {/* Brand Colors */}
            <div>
              <h3 className="heading-4 mb-lg text-brand">Brand Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
                {[
                  { name: 'Primary Indigo', bg: 'bg-brand', value: '#6366f1', desc: 'Main brand color' },
                  { name: 'Secondary Purple', bg: 'bg-secondary-brand', value: '#8b5cf6', desc: 'Secondary brand' },
                  { name: 'Accent Cyan', bg: 'bg-accent', value: '#06b6d4', desc: 'Highlights & accents' },
                ].map((color) => (
                  <div key={color.name} className="card space-y-md">
                    <div className={`${color.bg} h-32 rounded-lg shadow-lg`} />
                    <div>
                      <p className="font-semibold text-primary mb-xs">{color.name}</p>
                      <p className="text-secondary text-sm mb-xs">{color.value}</p>
                      <p className="caption">{color.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Semantic Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                {[
                  { name: 'Success', bg: 'bg-success', text: 'text-success', value: '#10b981', icon: Check },
                  { name: 'Info', bg: 'bg-info', text: 'text-info', value: '#3b82f6', icon: Info },
                  { name: 'Warning', bg: 'bg-warning', text: 'text-warning', value: '#f59e0b', icon: AlertCircle },
                  { name: 'Danger', bg: 'bg-danger', text: 'text-danger', value: '#ef4444', icon: XCircle },
                ].map((color) => {
                  const Icon = color.icon;
                  return (
                    <div key={color.name} className="card space-y-md">
                      <div className={`${color.bg} h-24 rounded-lg shadow-md flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className={`font-semibold ${color.text} mb-xs`}>{color.name}</p>
                        <p className="text-secondary text-sm">{color.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Background Colors */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Background Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                {[
                  { name: 'Primary', bg: 'bg-primary', value: '#ffffff', desc: 'Main background' },
                  { name: 'Secondary', bg: 'bg-secondary', value: '#f8fafc', desc: 'Secondary surfaces' },
                  { name: 'Tertiary', bg: 'bg-tertiary', value: '#f1f5f9', desc: 'Tertiary surfaces' },
                ].map((color) => (
                  <div key={color.name} className="card space-y-md">
                    <div className={`${color.bg} h-24 rounded-lg border-2 border-primary shadow-sm`} />
                    <div>
                      <p className="font-semibold text-primary mb-xs">{color.name}</p>
                      <p className="text-secondary text-sm mb-xs">{color.value}</p>
                      <p className="caption">{color.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Text Colors</h3>
              <div className="card space-y-md">
                <div className="text-primary heading-3">Primary Text - Main content</div>
                <div className="text-secondary heading-3">Secondary Text - Supporting content</div>
                <div className="text-tertiary heading-3">Tertiary Text - Subtle details</div>
                <div className="text-brand heading-3">Brand Text - Emphasis</div>
              </div>
            </div>
          </section>
        )}

        {/* Typography Section */}
        {activeSection === 'typography' && (
          <section className="space-y-3xl animate-fade-in">
            <div>
              <h2 className="heading-2 mb-md">Typography</h2>
              <p className="body-base text-secondary mb-xl">Font hierarchy and text styles</p>
            </div>

            {/* Headings */}
            <div>
              <h3 className="heading-4 mb-lg text-brand">Headings</h3>
              <div className="card space-y-xl">
                <div>
                  <p className="caption mb-sm">HEADING 1 - 48px Bold</p>
                  <h1 className="heading-1">The quick brown fox jumps</h1>
                </div>
                <div>
                  <p className="caption mb-sm">HEADING 2 - 36px Bold</p>
                  <h2 className="heading-2">The quick brown fox jumps</h2>
                </div>
                <div>
                  <p className="caption mb-sm">HEADING 3 - 30px Semibold</p>
                  <h3 className="heading-3">The quick brown fox jumps over</h3>
                </div>
                <div>
                  <p className="caption mb-sm">HEADING 4 - 24px Semibold</p>
                  <h4 className="heading-4">The quick brown fox jumps over the lazy</h4>
                </div>
              </div>
            </div>

            {/* Body Text */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Body Text</h3>
              <div className="card space-y-xl">
                <div>
                  <p className="caption mb-sm">BODY LARGE - 18px Regular</p>
                  <p className="body-large">
                    ContentFlow is an AI-powered written content creation platform designed to streamline the entire content production workflow.
                  </p>
                </div>
                <div>
                  <p className="caption mb-sm">BODY BASE - 16px Regular</p>
                  <p className="body-base">
                    ContentFlow is an AI-powered written content creation platform designed to streamline the entire content production workflow—from ideation to publication.
                  </p>
                </div>
                <div>
                  <p className="caption mb-sm">BODY SMALL - 14px Regular</p>
                  <p className="body-small">
                    ContentFlow is an AI-powered written content creation platform designed to streamline the entire content production workflow—from ideation to publication—for writers and teams.
                  </p>
                </div>
                <div>
                  <p className="caption mb-sm">CAPTION - 12px Regular</p>
                  <p className="caption">
                    ContentFlow is an AI-powered written content creation platform designed to streamline workflows for professional content creators.
                  </p>
                </div>
              </div>
            </div>

            {/* Font Weights */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Font Weights</h3>
              <div className="card space-y-md">
                <p className="text-2xl" style={{ fontWeight: 400 }}>Regular (400) - Body text</p>
                <p className="text-2xl" style={{ fontWeight: 500 }}>Medium (500) - Emphasis</p>
                <p className="text-2xl" style={{ fontWeight: 600 }}>Semibold (600) - Subheadings</p>
                <p className="text-2xl" style={{ fontWeight: 700 }}>Bold (700) - Headings</p>
              </div>
            </div>
          </section>
        )}

        {/* Buttons Section */}
        {activeSection === 'buttons' && (
          <section className="space-y-3xl animate-fade-in">
            <div>
              <h2 className="heading-2 mb-md">Buttons</h2>
              <p className="body-base text-secondary mb-xl">Interactive button components</p>
            </div>

            {/* Primary Buttons */}
            <div>
              <h3 className="heading-4 mb-lg text-brand">Primary Buttons</h3>
              <div className="card">
                <div className="flex flex-wrap gap-lg items-center">
                  <button className="btn btn-primary btn-lg">
                    <Send className="w-5 h-5" />
                    Publish Content
                  </button>
                  <button className="btn btn-primary">
                    <Pen className="w-4 h-4" />
                    Write
                  </button>
                  <button className="btn btn-primary btn-sm">
                    <Zap className="w-4 h-4" />
                    Generate
                  </button>
                  <button className="btn btn-primary" disabled>
                    Disabled
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Secondary Buttons</h3>
              <div className="card">
                <div className="flex flex-wrap gap-lg items-center">
                  <button className="btn btn-secondary btn-lg">
                    <FileText className="w-5 h-5" />
                    View Drafts
                  </button>
                  <button className="btn btn-secondary">
                    Save Draft
                  </button>
                  <button className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                  <button className="btn btn-secondary" disabled>
                    Disabled
                  </button>
                </div>
              </div>
            </div>

            {/* Ghost Buttons */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Ghost Buttons</h3>
              <div className="card bg-secondary">
                <div className="flex flex-wrap gap-lg items-center">
                  <button className="btn btn-ghost btn-lg">
                    <Star className="w-5 h-5" />
                    Favorite
                  </button>
                  <button className="btn btn-ghost">
                    Learn More
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    Skip
                  </button>
                  <button className="btn btn-ghost" disabled>
                    Disabled
                  </button>
                </div>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Icon Buttons</h3>
              <div className="card">
                <div className="flex flex-wrap gap-lg items-center">
                  <button className="w-12 h-12 rounded-lg bg-brand hover:bg-brand-hover text-inverse flex items-center justify-center transition-all shadow-md">
                    <Send className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-lg bg-secondary hover:bg-tertiary text-brand flex items-center justify-center transition-all border border-primary">
                    <Star className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-secondary-brand text-inverse flex items-center justify-center transition-all shadow-md hover:shadow-lg">
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cards Section */}
        {activeSection === 'cards' && (
          <section className="space-y-3xl animate-fade-in">
            <div>
              <h2 className="heading-2 mb-md">Cards</h2>
              <p className="body-base text-secondary mb-xl">Content card components</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {/* Basic Card */}
              <div className="card">
                <div className="w-full h-40 bg-gradient-to-br from-brand/20 to-secondary-brand/20 rounded-lg mb-lg flex items-center justify-center">
                  <FileText className="w-12 h-12 text-brand" />
                </div>
                <h3 className="heading-4 mb-sm">Blog Post</h3>
                <p className="body-small mb-lg">
                  Create engaging long-form content with AI-powered suggestions
                </p>
                <button className="btn btn-primary w-full">
                  Start Writing
                </button>
              </div>

              {/* Interactive Card */}
              <div className="card-interactive group">
                <div className="w-full h-40 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg mb-lg flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/10 transition-all">
                  <Zap className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="heading-4 mb-sm">AI Ideas</h3>
                <p className="body-small">
                  Generate content ideas instantly with AI
                </p>
              </div>

              {/* Compact Card */}
              <div className="card card-compact border-2 border-success/30 bg-success/5">
                <div className="flex items-start gap-md mb-md">
                  <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="heading-4 mb-xs text-success">Published</h3>
                    <p className="body-small">Successfully published to Medium</p>
                  </div>
                </div>
                <div className="text-sm text-secondary">2 hours ago</div>
              </div>

              {/* Elevated Card */}
              <div className="card card-elevated bg-gradient-to-br from-brand to-secondary-brand text-inverse">
                <Sparkles className="w-10 h-10 mb-lg" />
                <h3 className="text-xl font-bold mb-sm">Pro Feature</h3>
                <p className="text-sm opacity-90 mb-lg">
                  Unlock advanced AI capabilities and unlimited content generation
                </p>
                <button className="btn w-full bg-white text-brand hover:bg-tertiary">
                  Upgrade Now
                </button>
              </div>

              {/* Stats Card */}
              <div className="card">
                <div className="space-y-lg">
                  <div>
                    <p className="caption mb-xs">Content Created</p>
                    <p className="heading-2 text-brand">127</p>
                  </div>
                  <div className="divider" />
                  <div className="flex justify-between">
                    <div>
                      <p className="caption mb-xs">Published</p>
                      <p className="heading-4 text-success">45</p>
                    </div>
                    <div>
                      <p className="caption mb-xs">Drafts</p>
                      <p className="heading-4 text-warning">82</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* List Card */}
              <div className="card">
                <h3 className="heading-4 mb-lg">Recent Activity</h3>
                <div className="space-y-md">
                  {['Blog post published', 'Draft auto-saved', 'Idea generated'].map((item, i) => (
                    <div key={i} className="flex items-center gap-md py-sm px-md hover:bg-secondary rounded-md transition-colors">
                      <div className="w-2 h-2 bg-brand rounded-full" />
                      <span className="body-small flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Forms Section */}
        {activeSection === 'forms' && (
          <section className="space-y-3xl animate-fade-in">
            <div>
              <h2 className="heading-2 mb-md">Form Elements</h2>
              <p className="body-base text-secondary mb-xl">Input components and form controls</p>
            </div>

            <div className="max-w-2xl space-y-xl">
              {/* Text Input */}
              <div className="card">
                <label className="block body-small font-semibold mb-md text-primary">Content Title</label>
                <input
                  type="text"
                  placeholder="Enter your content title..."
                  className="input"
                />
                <p className="caption mt-sm">Choose a compelling title for your content</p>
              </div>

              {/* Textarea */}
              <div className="card">
                <label className="block body-small font-semibold mb-md text-primary">Content Description</label>
                <textarea
                  placeholder="Describe your content..."
                  className="input resize-none"
                  rows={4}
                />
              </div>

              {/* Select */}
              <div className="card">
                <label className="block body-small font-semibold mb-md text-primary">Content Type</label>
                <select className="input">
                  <option>Choose content type</option>
                  <option>Blog Post</option>
                  <option>Social Media Post</option>
                  <option>Video Script</option>
                  <option>Newsletter</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="card">
                <label className="block body-small font-semibold mb-md text-primary">Publishing Options</label>
                <div className="space-y-md">
                  {['Publish to Medium', 'Share on Twitter', 'Send to newsletter'].map((option, i) => (
                    <label key={i} className="flex items-center gap-md cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-primary accent-brand cursor-pointer"
                      />
                      <span className="body-base group-hover:text-brand transition-colors">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Radio Buttons */}
              <div className="card">
                <label className="block body-small font-semibold mb-md text-primary">AI Model</label>
                <div className="space-y-md">
                  {['Claude (Recommended)', 'GPT-4', 'Gemini'].map((model, i) => (
                    <label key={i} className="flex items-center gap-md cursor-pointer group">
                      <input
                        type="radio"
                        name="model"
                        className="w-5 h-5 border-primary accent-brand cursor-pointer"
                        defaultChecked={i === 0}
                      />
                      <span className="body-base group-hover:text-brand transition-colors">{model}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Input States */}
              <div className="card space-y-lg">
                <div>
                  <label className="block body-small font-semibold mb-md text-primary">Normal State</label>
                  <input type="text" placeholder="Normal input" className="input" />
                </div>
                <div>
                  <label className="block body-small font-semibold mb-md text-danger">Error State</label>
                  <input type="text" placeholder="Error input" className="input input-error" />
                  <p className="text-danger text-sm mt-sm">This field is required</p>
                </div>
                <div>
                  <label className="block body-small font-semibold mb-md text-secondary">Disabled State</label>
                  <input type="text" placeholder="Disabled input" className="input" disabled />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Components Section */}
        {activeSection === 'components' && (
          <section className="space-y-3xl animate-fade-in">
            <div>
              <h2 className="heading-2 mb-md">UI Components</h2>
              <p className="body-base text-secondary mb-xl">Reusable interface components</p>
            </div>

            {/* Badges */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Badges</h3>
              <div className="card">
                <div className="flex flex-wrap gap-md">
                  <span className="badge badge-primary">Primary</span>
                  <span className="badge badge-success">Published</span>
                  <span className="badge badge-info">Draft</span>
                  <span className="badge badge-warning">Pending</span>
                  <span className="badge badge-danger">Failed</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Alert Messages</h3>
              <div className="space-y-lg max-w-2xl">
                <div className="alert alert-success">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-xs">Success!</p>
                    <p className="text-sm opacity-90">Your content has been published successfully</p>
                  </div>
                </div>

                <div className="alert alert-info">
                  <Info className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-xs">Information</p>
                    <p className="text-sm opacity-90">Your draft will be auto-saved every 30 seconds</p>
                  </div>
                </div>

                <div className="alert alert-warning">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-xs">Warning</p>
                    <p className="text-sm opacity-90">You have reached 80% of your monthly word limit</p>
                  </div>
                </div>

                <div className="alert alert-danger">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-xs">Error</p>
                    <p className="text-sm opacity-90">Failed to publish content. Please try again</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bars */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Progress Indicators</h3>
              <div className="card space-y-xl max-w-2xl">
                <div>
                  <div className="flex justify-between body-small mb-md">
                    <span className="font-medium">Content Generation</span>
                    <span className="text-secondary">75%</span>
                  </div>
                  <div className="w-full h-2 bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-gradient-to-r from-brand to-secondary-brand rounded-full transition-all duration-300" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between body-small mb-md">
                    <span className="font-medium">Publishing</span>
                    <span className="text-success">Complete</span>
                  </div>
                  <div className="w-full h-2 bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full w-full bg-success rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dividers */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Dividers</h3>
              <div className="card space-y-lg max-w-2xl">
                <div className="divider" />
                <div className="flex items-center gap-lg">
                  <div className="flex-1 divider" />
                  <span className="text-secondary body-small">OR</span>
                  <div className="flex-1 divider" />
                </div>
              </div>
            </div>

            {/* Loading States */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Loading States</h3>
              <div className="card space-y-lg max-w-2xl">
                <div className="skeleton h-12 w-full" />
                <div className="skeleton h-24 w-full" />
                <div className="skeleton h-8 w-2/3" />
              </div>
            </div>

            {/* Shadows */}
            <div>
              <h3 className="heading-4 mb-lg text-primary">Shadow Levels</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-lg">
                {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
                  <div key={size} className={`card shadow-${size} text-center`}>
                    <p className="body-small font-semibold">shadow-{size}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary bg-secondary mt-3xl">
        <div className="max-w-7xl mx-auto px-xl py-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-lg">
            <div className="flex items-center gap-md">
              <div className="w-8 h-8 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-inverse" />
              </div>
              <span className="font-semibold text-primary">ContentFlow Design System</span>
            </div>
            <p className="body-small text-secondary">© 2025 ContentFlow. Professional content creation platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
