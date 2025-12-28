/**
 * @krisspy-file
 * @type page
 * @name "ContentAnalysis"
 * @title "Content Analysis & Processing"
 * @description "AI-powered content analysis with SEO, readability, plagiarism, and tone detection"
 * @routes ["/analysis"]
 * @requiresAuth false
 */

import React, { useState } from 'react';
import {
  Search,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Volume2,
  Eye,
  AlertTriangle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';

interface AnalysisResult {
  seoScore: number;
  readabilityScore: number;
  plagiarismScore: number;
  toneAnalysis: {
    dominant: string;
    confidence: number;
    alternatives: string[];
  };
  keyMetrics: {
    wordCount: number;
    sentenceCount: number;
    averageWordLength: number;
    fleschKincaidGrade: number;
  };
  suggestions: string[];
}

export default function ContentAnalysis() {
  const { addToast } = useToast();
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      addToast('Please enter content to analyze', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock analysis results
      setAnalysis({
        seoScore: 82,
        readabilityScore: 76,
        plagiarismScore: 2,
        toneAnalysis: {
          dominant: 'Professional',
          confidence: 0.92,
          alternatives: ['Informative', 'Technical'],
        },
        keyMetrics: {
          wordCount: content.split(/\s+/).length,
          sentenceCount: content.split(/[.!?]+/).length - 1,
          averageWordLength: 5.2,
          fleschKincaidGrade: 8.5,
        },
        suggestions: [
          'Add more transition words to improve flow',
          'Consider breaking down paragraphs for better readability',
          'Include more specific data points and examples',
          'Add a clear call-to-action at the end',
        ],
      });

      addToast('Analysis complete!', 'success');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-danger/10';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        {/* Header */}
        <div className="border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-inverse" />
              </div>
              <div>
                <h1 className="heading-2">Content Analysis</h1>
                <p className="body-small text-secondary">AI-powered analysis and optimization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-xl py-3xl space-y-3xl">
          {/* Input Section */}
          <section>
            <Card variant="default">
              <CardHeader>
                <CardTitle>Paste Your Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-lg">
                  <Textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Paste or write your content here to analyze it for SEO, readability, plagiarism, and tone..."
                    rows={8}
                  />
                  <div className="flex items-center justify-between flex-wrap gap-lg">
                    <span className="caption text-secondary">
                      {content.split(/\s+/).filter(Boolean).length} words
                    </span>
                    <Button
                      variant="primary"
                      onClick={handleAnalyze}
                      loading={isAnalyzing}
                      disabled={!content.trim()}
                    >
                      <Zap className="w-4 h-4" />
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Analysis Results */}
          {analysis && (
            <>
              {/* Score Cards */}
              <section>
                <h2 className="heading-3 mb-lg">Analysis Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                  {[
                    {
                      label: 'SEO Score',
                      score: analysis.seoScore,
                      icon: <Search className="w-6 h-6" />,
                    },
                    {
                      label: 'Readability',
                      score: analysis.readabilityScore,
                      icon: <Eye className="w-6 h-6" />,
                    },
                    {
                      label: 'Originality',
                      score: 100 - analysis.plagiarismScore,
                      icon: <CheckCircle className="w-6 h-6" />,
                    },
                    {
                      label: 'Tone Confidence',
                      score: Math.round(analysis.toneAnalysis.confidence * 100),
                      icon: <Volume2 className="w-6 h-6" />,
                    },
                  ].map((item, idx) => (
                    <Card key={idx} variant="default" className={getScoreBg(item.score)}>
                      <div className="space-y-md">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-secondary">{item.label}</span>
                          {item.icon}
                        </div>
                        <div className="flex items-center gap-md">
                          <div className="flex-1">
                            <div className="h-3 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  item.score >= 80
                                    ? 'bg-success'
                                    : item.score >= 60
                                      ? 'bg-warning'
                                      : 'bg-danger'
                                }`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>
                          <span className={`heading-3 ${getScoreColor(item.score)}`}>{item.score}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Tone Analysis */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Tone Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-lg">
                      <div>
                        <p className="caption text-secondary mb-sm">Dominant Tone</p>
                        <p className="heading-3 text-brand mb-md">{analysis.toneAnalysis.dominant}</p>
                        <div className="flex items-center gap-sm">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand rounded-full"
                              style={{ width: `${analysis.toneAnalysis.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-brand">
                            {Math.round(analysis.toneAnalysis.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="caption text-secondary mb-sm">Alternative Tones</p>
                        <div className="flex flex-wrap gap-sm">
                          {analysis.toneAnalysis.alternatives.map((tone, idx) => (
                            <span key={idx} className="badge badge-info">
                              {tone}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-md">
                      {[
                        {
                          label: 'Word Count',
                          value: analysis.keyMetrics.wordCount,
                          suffix: 'words',
                        },
                        {
                          label: 'Sentences',
                          value: analysis.keyMetrics.sentenceCount,
                          suffix: 'sentences',
                        },
                        {
                          label: 'Avg Word Length',
                          value: analysis.keyMetrics.averageWordLength,
                          suffix: 'characters',
                        },
                        {
                          label: 'Reading Level',
                          value: `Grade ${analysis.keyMetrics.fleschKincaidGrade}`,
                          suffix: 'Flesch-Kincaid',
                        },
                      ].map((metric, idx) => (
                        <div key={idx} className="pb-md border-b border-primary last:border-0 last:pb-0">
                          <p className="caption text-secondary mb-sm">{metric.label}</p>
                          <div className="flex items-baseline gap-sm">
                            <span className="heading-3 text-brand">{metric.value}</span>
                            <span className="text-sm text-secondary">{metric.suffix}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Suggestions */}
              <section>
                <Card variant="default">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-md">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      Optimization Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-md">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-md pb-md border-b border-primary last:border-0 last:pb-0">
                          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                          <p className="body-small text-primary">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Action Buttons */}
              <section className="flex gap-lg flex-wrap justify-center">
                <Button variant="primary">
                  <Download className="w-4 h-4" />
                  Download Report
                </Button>
                <Button variant="secondary">
                  <RefreshCw className="w-4 h-4" />
                  Analyze Again
                </Button>
              </section>
            </>
          )}

          {/* Empty State */}
          {!analysis && !isAnalyzing && !content && (
            <Card variant="default" className="text-center py-xl">
              <Zap className="w-12 h-12 mx-auto text-secondary opacity-50 mb-lg" />
              <p className="body-base text-secondary mb-md">No content to analyze yet</p>
              <p className="body-small text-secondary">
                Paste your content above to get AI-powered insights on SEO, readability, plagiarism,
                and tone
              </p>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
