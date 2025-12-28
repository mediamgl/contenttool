import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'knowledge-base-documents';

export const storageService = {
  async initializeBucket(): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: false,
          fileSizeLimit: 52428800,
        });

        if (error) throw error;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Initialize bucket error:', error);
      return { success: false, error: error.message || 'Failed to initialize storage bucket' };
    }
  },

  async uploadDocument(
    file: File,
    title: string,
    description?: string,
    tags?: string[]
  ): Promise<{ success: boolean; documentId?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      await this.initializeBucket();

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: document, error: dbError } = await supabase
        .from('knowledge_base_documents')
        .insert({
          user_id: user.id,
          title,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size,
          description,
          tags: tags || [],
        })
        .select()
        .single();

      if (dbError) {
        await supabase.storage.from(BUCKET_NAME).remove([fileName]);
        throw dbError;
      }

      return { success: true, documentId: document.id };
    } catch (error: any) {
      console.error('Upload document error:', error);
      return { success: false, error: error.message || 'Failed to upload document' };
    }
  },

  async getDocuments(): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase
        .from('knowledge_base_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Get documents error:', error);
      return { success: false, error: error.message || 'Failed to get documents' };
    }
  },

  async downloadDocument(
    filePath: string
  ): Promise<{ success: boolean; data?: Blob; error?: string }> {
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).download(filePath);

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Download document error:', error);
      return { success: false, error: error.message || 'Failed to download document' };
    }
  },

  async deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data: document, error: fetchError } = await supabase
        .from('knowledge_base_documents')
        .select('file_path')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (document) {
        await supabase.storage.from(BUCKET_NAME).remove([document.file_path]);
      }

      const { error: deleteError } = await supabase
        .from('knowledge_base_documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (error: any) {
      console.error('Delete document error:', error);
      return { success: false, error: error.message || 'Failed to delete document' };
    }
  },

  async getSignedUrl(filePath: string, expiresIn = 3600): Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;

      return { success: true, url: data.signedUrl };
    } catch (error: any) {
      console.error('Get signed URL error:', error);
      return { success: false, error: error.message || 'Failed to get signed URL' };
    }
  },
};
