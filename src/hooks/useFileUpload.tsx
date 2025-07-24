import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface FileInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  base64: string;
  uploadPath: string;
}

export interface FileUploadState {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  uploadedFiles: FileInfo[];
}

export const useFileUpload = () => {
  const { user } = useAuth();
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    uploadProgress: 0,
    error: null,
    uploadedFiles: [],
  });

  const validateFile = useCallback((file: File): string | null => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Allowed types: Images, PDF, TXT, DOC, DOCX`;
    }

    // 10MB file size limit
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  }, []);

  const uploadFiles = useCallback(async (files: FileList): Promise<FileInfo[]> => {
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    setState(prev => ({ ...prev, isUploading: true, error: null, uploadProgress: 0 }));

    const uploadedFiles: FileInfo[] = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        // Update progress
        setState(prev => ({ 
          ...prev, 
          uploadProgress: Math.round(((i + 0.5) / totalFiles) * 100) 
        }));

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

        // Upload using Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('process-file', {
          body: formData,
        });

        if (error) {
          let errorMsg = error.message || `Failed to upload ${file.name}`;
          // Check if it's a validation error with details
          if (data?.error && data?.details) {
            errorMsg = `${data.error}: ${Array.isArray(data.details) ? data.details.join(', ') : data.details}`;
          }
          throw new Error(errorMsg);
        }

        uploadedFiles.push(data.file);

        // Update progress
        setState(prev => ({ 
          ...prev, 
          uploadProgress: Math.round(((i + 1) / totalFiles) * 100) 
        }));
      }

      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadProgress: 100,
        uploadedFiles: [...prev.uploadedFiles, ...uploadedFiles]
      }));

      return uploadedFiles;

    } catch (error) {
      console.error('Error uploading files:', error);
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        uploadProgress: 0,
        error: error instanceof Error ? error.message : 'Failed to upload files'
      }));
      throw error;
    }
  }, [user, validateFile]);

  const removeFile = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(file => file.id !== fileId)
    }));
  }, []);

  const clearFiles = useCallback(() => {
    setState(prev => ({
      ...prev,
      uploadedFiles: [],
      error: null,
    }));
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    state,
    uploadFiles,
    removeFile,
    clearFiles,
    formatFileSize,
    validateFile,
  };
};