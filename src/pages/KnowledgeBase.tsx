/**
 * @krisspy-file
 * @type page
 * @name "KnowledgeBase"
 * @title "Knowledge Base"
 * @description "Upload and manage reference documents for AI context"
 * @routes ["/knowledge-base"]
 * @requiresAuth false
 */

import React, { useState } from 'react';
import { HardDrive, Upload, FileText, Trash2, Eye } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export default function KnowledgeBase() {
  const { addToast } = useToast();
  const [documents] = useState<any[]>([]);

  return (
    <MainLayout>
      <div className="min-h-screen bg-primary">
        <div className="border-b border-primary p-xl">
          <div className="max-w-7xl mx-auto flex items-center gap-md mb-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-brand to-secondary-brand rounded-lg flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-inverse" />
            </div>
            <div>
              <h1 className="heading-2">Knowledge Base</h1>
              <p className="body-small text-secondary">Upload and manage reference documents</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-xl py-3xl">
          {documents.length === 0 ? (
            <Card className="text-center py-xl">
              <HardDrive className="w-12 h-12 mx-auto text-secondary opacity-50 mb-lg" />
              <p className="body-base text-secondary mb-lg">No documents yet</p>
              <p className="body-small text-secondary mb-lg">Upload your documents to provide context for AI</p>
              <Button
                variant="primary"
                onClick={() => addToast('Upload feature coming soon', 'info')}
              >
                <Upload className="w-4 h-4" />
                Upload Documents
              </Button>
            </Card>
          ) : (
            <div className="space-y-md">
              {documents.map((doc: any) => (
                <Card key={doc.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-md">
                      <FileText className="w-5 h-5 text-brand" />
                      <div>
                        <p className="heading-4">{doc.name}</p>
                        <p className="body-small text-secondary">{doc.size} • {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-md">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
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
