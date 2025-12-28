/**
 * @krisspy-file
 * @type page
 * @name "Editor"
 * @title "Content Editor"
 * @description "Rich text editor with AI assistance for writing content"
 * @routes ["/editor"]
 * @requiresAuth false
 */

import React, { useState, useEffect } from 'react';
import {
  Save,
  Download,
  Wand2,
  FileText,
  Eye,
  Code,
  Bold,
  Italic,
  List,
  Heading2,
  Link as LinkIcon,
  MoreVertical,
  Sparkles,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { aiService } from '../services/aiService';

type ViewMode = 'write' | 'preview' | 'split';

interface EditorState {
  title: string;
  content: string;
  mode: ViewMode;
  wordCount: number;
  characterCount: number;
  isDirty: boolean;
}

export default function Editor() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { addContent, content, outlines, ideas } = useContent();
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<EditorState>({
    title: 'Untitled Document',
    content: '',
    mode: 'write',
    wordCount: 0,
    characterCount: 0,
    isDirty: false,
  });

  const [showAiMenu, setShowAiMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentContentId, setCurrentContentId] = useState<string | null>(null);

  // Handle URL parameters to load existing content, outlines, or ideas
  useEffect(() => {
    const contentId = searchParams.get('contentId');
    const outlineId = searchParams.get('outlineId');
    const ideaId = searchParams.get('ideaId');

    if (contentId) {
      // Load existing content for editing
      const existingContent = content.find(c => c.id === contentId);
      if (existingContent) {
        setState(prev => ({
          ...prev,
          title: existingContent.title,
          content: existingContent.content,
        }));
        setCurrentContentId(contentId);
      }
    } else if (outlineId) {
      // Load outline and create content from it
      const outline = outlines.find(o => o.id === outlineId);
      if (outline) {
        let contentFromOutline = `${outline.hook}\n\n`;
        outline.sections.forEach((section: any) => {
          contentFromOutline += `## ${section.heading}\n\n`;
          section.keyPoints.forEach((point: string) => {
            contentFromOutline += `- ${point}\n`;
          });
          contentFromOutline += '\n';
        });
        contentFromOutline += `\n${outline.cta}`;

        setState(prev => ({
          ...prev,
          title: outline.title,
          content: contentFromOutline,
        }));
      }
    } else if (ideaId) {
      // Load idea and pre-fill title
      const idea = ideas.find(i => i.id === ideaId);
      if (idea) {
        setState(prev => ({
          ...prev,
          title: idea.title,
          content: `# ${idea.title}\n\n${idea.description}\n\n`,
        }));
      }
    }
  }, [searchParams, content, outlines, ideas]);

  // Update word and character counts
  useEffect(() => {
    const words = state.content.trim() === '' ? 0 : state.content.trim().split(/\s+/).length;
    const chars = state.content.length;
    setState(prev => ({
      ...prev,
      wordCount: words,
      characterCount: chars,
    }));
  }, [state.content]);

  const handleSave = () => {
    if (!state.title.trim() || !state.content.trim()) {
      addToast('Title and content are required', 'error');
      return;
    }

    if (!user) {
      addToast('Please log in to save content', 'error');
      return;
    }

    // If editing existing content, we would update it here
    // For now, always creating new content
    const contentId = addContent({
      userId: user.id,
      title: state.title,
      content: state.content,
      contentType: 'blog',
      targetPlatform: 'medium',
      wordCount: state.wordCount,
      characterCount: state.characterCount,
      status: 'draft',
      tags: [],
    });

    setCurrentContentId(contentId);
    addToast('Content saved!', 'success');
    setState(prev => ({ ...prev, isDirty: false }));
  };

  const handleFormatting = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = state.content.substring(start, end);
    const before = state.content.substring(0, start);
    const after = state.content.substring(end);

    let newContent = state.content;
    switch (format) {
      case 'bold':
        newContent = before + `**${selected}**` + after;
        break;
      case 'italic':
        newContent = before + `*${selected}*` + after;
        break;
      case 'h2':
        newContent = before + `\n## ${selected}\n` + after;
        break;
      case 'ul':
        newContent = before + `\n- ${selected}\n` + after;
        break;
      case 'link':
        newContent = before + `[${selected}](url)` + after;
        break;
    }

    setState(prev => ({ ...prev, content: newContent, isDirty: true }));
  };

  const handleAiAction = async (action: string) => {
    if (!user) {
      addToast('Please log in to use AI features', 'error');
      return;
    }

    // Get selected text or use last paragraph if nothing selected
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let textToProcess = textarea.value.substring(start, end);

    // If no selection, work on the last paragraph
    if (!textToProcess.trim()) {
      const paragraphs = state.content.split('\n\n');
      textToProcess = paragraphs[paragraphs.length - 1] || state.content;
    }

    if (!textToProcess.trim()) {
      addToast('Please select text or write something first', 'error');
      return;
    }

    setIsLoading(true);
    try {
      let response;

      switch (action) {
        case 'expand':
          response = await aiService.expandText(textToProcess);
          break;
        case 'condense':
          response = await aiService.condenseText(textToProcess);
          break;
        case 'improve':
          response = await aiService.improveText(textToProcess);
          break;
        case 'rephrase':
          response = await aiService.rephraseText(textToProcess);
          break;
        default:
          throw new Error('Unknown action');
      }

      if (response.success && response.data) {
        // Replace selected text or append
        if (start !== end) {
          const before = state.content.substring(0, start);
          const after = state.content.substring(end);
          setState(prev => ({
            ...prev,
            content: before + response.data + after,
            isDirty: true,
          }));
        } else {
          setState(prev => ({
            ...prev,
            content: prev.content + '\n\n' + response.data,
            isDirty: true,
          }));
        }
        addToast(`Content ${action}ed!`, 'success');
      } else {
        addToast(response.error || 'AI action failed', 'error');
      }
    } catch (error) {
      addToast('AI action failed', 'error');
      console.error('Error with AI action:', error);
    } finally {
      setIsLoading(false);
      setShowAiMenu(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-primary bg-secondary p-lg sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-lg flex-wrap">
            <input
              type="text"
              className="input bg-primary font-semibold text-lg flex-1 min-w-[200px]"
              value={state.title}
              onChange={e => setState(prev => ({ ...prev, title: e.target.value, isDirty: true }))}
              placeholder="Untitled Document"
            />

            <div className="flex items-center gap-md flex-wrap">
              <div className="hidden sm:flex items-center gap-md border-r border-primary pr-lg">
                <button
                  onClick={() => setState(prev => ({ ...prev, mode: 'write' }))}
                  className={`p-md rounded transition-colors ${
                    state.mode === 'write' ? 'bg-brand text-inverse' : 'hover:bg-primary text-secondary'
                  }`}
                  title="Write mode"
                >
                  <FileText className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setState(prev => ({ ...prev, mode: 'preview' }))}
                  className={`p-md rounded transition-colors ${
                    state.mode === 'preview' ? 'bg-brand text-inverse' : 'hover:bg-primary text-secondary'
                  }`}
                  title="Preview mode"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setState(prev => ({ ...prev, mode: 'split' }))}
                  className={`p-md rounded transition-colors ${
                    state.mode === 'split' ? 'bg-brand text-inverse' : 'hover:bg-primary text-secondary'
                  }`}
                  title="Split view"
                >
                  <Code className="w-5 h-5" />
                </button>
              </div>

              <Button variant="ghost" size="sm" onClick={() => setShowAiMenu(!showAiMenu)}>
                <Wand2 className="w-4 h-4" />
                AI
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setShowExportModal(true)}>
                <Download className="w-4 h-4" />
              </Button>

              <Button variant="primary" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>

          {/* AI Menu */}
          {showAiMenu && (
            <div className="mt-lg p-md bg-primary rounded-lg border border-primary flex gap-md flex-wrap animate-slide-in">
              <Button variant="ghost" size="sm" onClick={() => handleAiAction('expand')} loading={isLoading}>
                <Sparkles className="w-4 h-4" />
                Expand
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleAiAction('condense')} loading={isLoading}>
                <Sparkles className="w-4 h-4" />
                Condense
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleAiAction('improve')} loading={isLoading}>
                <Sparkles className="w-4 h-4" />
                Improve
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleAiAction('rephrase')} loading={isLoading}>
                <Sparkles className="w-4 h-4" />
                Rephrase
              </Button>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Write / Split Pane */}
          {(state.mode === 'write' || state.mode === 'split') && (
            <div className={`flex flex-col ${state.mode === 'split' ? 'w-1/2' : 'w-full'} border-r border-primary`}>
              {/* Formatting Toolbar */}
              <div className="border-b border-primary bg-secondary p-md flex gap-sm flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFormatting('bold')}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleFormatting('italic')} title="Italic">
                  <Italic className="w-4 h-4" />
                </Button>
                <div className="w-px bg-primary" />
                <Button variant="ghost" size="sm" onClick={() => handleFormatting('h2')} title="Heading">
                  <Heading2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleFormatting('ul')} title="List">
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleFormatting('link')} title="Link">
                  <LinkIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Textarea */}
              <textarea
                className="flex-1 p-lg bg-primary text-primary font-mono text-sm resize-none focus:outline-none"
                value={state.content}
                onChange={e => setState(prev => ({ ...prev, content: e.target.value, isDirty: true }))}
                placeholder="Start typing your content here...&#10;&#10;Use Markdown formatting:&#10;**bold** for bold&#10;*italic* for italic&#10;## Heading for heading&#10;- List items"
              />

              {/* Word Count */}
              <div className="border-t border-primary bg-secondary px-lg py-md flex justify-end gap-xl text-sm text-secondary">
                <span>Words: {state.wordCount}</span>
                <span>Characters: {state.characterCount}</span>
              </div>
            </div>
          )}

          {/* Preview / Split Pane */}
          {(state.mode === 'preview' || state.mode === 'split') && (
            <div className={`flex flex-col ${state.mode === 'split' ? 'w-1/2' : 'w-full'} overflow-y-auto`}>
              <div className="p-lg prose max-w-none">
                <div className="p-xl bg-secondary rounded-lg border border-primary">
                  <h1 className="heading-1 mb-lg">{state.title}</h1>
                  <div className="body-base text-primary whitespace-pre-wrap">
                    {state.content || '(No content yet)'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Modal */}
        <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)} title="Export Content" size="md">
          <div className="space-y-lg">
            <p className="body-small text-secondary">Choose a format to export your content</p>

            <div className="space-y-md">
              {[
                { format: 'Markdown', ext: '.md' },
                { format: 'HTML', ext: '.html' },
                { format: 'Plain Text', ext: '.txt' },
                { format: 'PDF', ext: '.pdf' },
              ].map(option => (
                <button
                  key={option.format}
                  className="w-full p-lg text-left border border-primary rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => {
                    addToast(`Exporting as ${option.format}...`, 'success');
                    setShowExportModal(false);
                  }}
                >
                  <div className="font-semibold text-primary">{option.format}</div>
                  <div className="text-sm text-secondary">{option.ext}</div>
                </button>
              ))}
            </div>

            <Button variant="secondary" className="w-full" onClick={() => setShowExportModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
