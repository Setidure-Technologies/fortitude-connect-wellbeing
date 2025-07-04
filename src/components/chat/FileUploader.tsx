import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Paperclip, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { useFileUpload, FileInfo } from '@/hooks/useFileUpload';

interface FileUploaderProps {
  onFilesUploaded: (files: FileInfo[]) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesUploaded, 
  disabled = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state, uploadFiles, removeFile, formatFileSize } = useFileUpload();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadedFiles = await uploadFiles(files);
      onFilesUploaded(uploadedFiles);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  const handleRemoveFile = (fileId: string) => {
    removeFile(fileId);
  };

  return (
    <div className="flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*,.pdf,.txt,.doc,.docx"
      />
      
      <Button
        size="icon"
        variant="outline"
        onClick={handleFileSelect}
        disabled={disabled || state.isUploading}
        className="h-10 w-10"
        title="Attach files"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {state.isUploading && (
        <div className="mt-2 w-32">
          <Progress value={state.uploadProgress} className="h-1" />
          <span className="text-xs text-muted-foreground">
            Uploading... {state.uploadProgress}%
          </span>
        </div>
      )}

      {state.error && (
        <span className="text-xs text-red-500 mt-1 max-w-32 truncate">
          {state.error}
        </span>
      )}

      {state.uploadedFiles.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-background border rounded-lg shadow-lg max-w-sm">
          <div className="text-xs text-muted-foreground mb-2">
            Attached files ({state.uploadedFiles.length}):
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {state.uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-2 p-1 bg-muted rounded text-xs"
              >
                <div className="flex items-center gap-1 min-w-0">
                  {getFileIcon(file.type)}
                  <span className="truncate" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-muted-foreground">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveFile(file.id)}
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};