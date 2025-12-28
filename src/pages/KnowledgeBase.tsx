/**
 * @krisspy-file
 * @type page
 * @name "KnowledgeBase"
 * @title "Knowledge Base"
 * @description "Upload and manage reference documents for AI context"
 * @routes ["/knowledge-base"]
 * @requiresAuth false
 */

import React, { useState, useEffect, useRef } from 'react';
import { HardDrive, Upload, FileText, Trash2, Eye, Loader } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { storageService } from '../services/storageService';

export default function KnowledgeBase() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents on mount
  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await storageService.getDocuments(user.id);
      if (response.success && response.data) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadTitle(file.name);
      setShowUploadModal(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      addToast('Please select a file', 'error');
      return;
    }

    if (!uploadTitle.trim()) {
      addToast('Please enter a title', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const response = await storageService.uploadDocument(
        selectedFile,
        uploadTitle,
        uploadDescription,
        [],
        user.id
      );

      if (response.success) {
        addToast('Document uploaded successfully!', 'success');
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadTitle('');
        setUploadDescription('');
        loadDocuments();
      } else {
        addToast(response.error || 'Upload failed', 'error');
      }
    } catch (error) {
      addToast('Upload failed', 'error');
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!user) return;

    try {
      const response = await storageService.deleteDocument(documentId, user.id);
      if (response.success) {
        addToast('Document deleted', 'success');
        loadDocuments();
      } else {
        addToast(response.error || 'Delete failed', 'error');
      }
    } catch (error) {
      addToast('Delete failed', 'error');
      console.error('Error deleting document:', error);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await storageService.downloadDocument(filePath);
      if (response.success && response.data) {
        // Create download link
        const url = response.data.url;
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        addToast('Download started', 'success');
      } else {
        addToast(response.error || 'Download failed', 'error');
      }
    } catch (error) {
      addToast('Download failed', 'error');
      console.error('Error downloading document:', error);
    }
  };

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
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md"
          />

          {isLoading ? (
            <Card className="text-center py-xl">
              <Loader className="w-12 h-12 mx-auto text-brand opacity-50 mb-lg animate-spin" />
              <p className="body-base text-secondary">Loading documents...</p>
            </Card>
          ) : documents.length === 0 ? (
            <Card className="text-center py-xl">
              <HardDrive className="w-12 h-12 mx-auto text-secondary opacity-50 mb-lg" />
              <p className="body-base text-secondary mb-lg">No documents yet</p>
              <p className="body-small text-secondary mb-lg">Upload your documents to provide context for AI</p>
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Upload Documents
              </Button>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-lg">
                <p className="body-base text-secondary">{documents.length} documents</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>
              <div className="space-y-md">
                {documents.map((doc: any) => (
                  <Card key={doc.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-md">
                        <FileText className="w-5 h-5 text-brand" />
                        <div>
                          <p className="heading-4">{doc.title}</p>
                          <p className="body-small text-secondary">
                            {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'Unknown size'} •
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                          {doc.description && (
                            <p className="body-small text-secondary mt-sm">{doc.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc.file_path, doc.title)}
                          title="Download"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-danger" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
        size="md"
      >
        <div className="space-y-lg">
          {selectedFile && (
            <div className="p-md bg-secondary rounded-lg border border-primary">
              <div className="flex items-center gap-md">
                <FileText className="w-5 h-5 text-brand" />
                <div className="flex-1">
                  <p className="body-small font-semibold text-primary">{selectedFile.name}</p>
                  <p className="caption text-secondary">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          <Input
            label="Title"
            value={uploadTitle}
            onChange={e => setUploadTitle(e.target.value)}
            placeholder="Enter document title"
          />

          <Input
            label="Description (optional)"
            value={uploadDescription}
            onChange={e => setUploadDescription(e.target.value)}
            placeholder="Brief description of the document"
          />

          <div className="flex gap-md">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowUploadModal(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleUpload}
              loading={isUploading}
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
