/**
 * File Security Utilities
 * Enhanced file validation to prevent malicious uploads
 */

// Maximum file sizes (in bytes)
export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  audio: 25 * 1024 * 1024, // 25MB
  video: 100 * 1024 * 1024, // 100MB
} as const;

// Allowed MIME types with corresponding file extensions
export const ALLOWED_FILE_TYPES = {
  image: {
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'] as readonly string[],
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'] as readonly string[]
  },
  document: {
    mimeTypes: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] as readonly string[],
    extensions: ['.pdf', '.txt', '.doc', '.docx'] as readonly string[]
  },
  audio: {
    mimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'] as readonly string[],
    extensions: ['.mp3', '.wav', '.ogg', '.m4a'] as readonly string[]
  }
};

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedName?: string;
}

/**
 * Comprehensive file validation with content-based checking
 */
export async function validateFile(
  file: File, 
  allowedCategory: keyof typeof ALLOWED_FILE_TYPES
): Promise<FileValidationResult> {
  try {
    // Check file size
    const maxSize = MAX_FILE_SIZES[allowedCategory];
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`
      };
    }

    // Check MIME type
    const allowedTypes = ALLOWED_FILE_TYPES[allowedCategory];
    if (!allowedTypes.mimeTypes.includes(file.type as any)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    // Check file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.extensions.includes(fileExtension as any)) {
      return {
        isValid: false,
        error: `File extension ${fileExtension} is not allowed`
      };
    }

    // Content-based validation for images
    if (allowedCategory === 'image') {
      const isValidImage = await validateImageContent(file);
      if (!isValidImage) {
        return {
          isValid: false,
          error: 'File appears to be corrupted or is not a valid image'
        };
      }
    }

    // Sanitize filename
    const sanitizedName = sanitizeFilename(file.name);

    return {
      isValid: true,
      sanitizedName
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'File validation failed'
    };
  }
}

/**
 * Validate image content by attempting to load it
 */
async function validateImageContent(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    
    img.src = url;
    
    // Timeout after 5 seconds
    setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve(false);
    }, 5000);
  });
}

/**
 * Sanitize filename to prevent path traversal and other attacks
 */
function sanitizeFilename(filename: string): string {
  // Remove path separators and special characters
  let sanitized = filename.replace(/[\/\\:*?"<>|]/g, '_');
  
  // Remove leading dots and spaces
  sanitized = sanitized.replace(/^[\.\s]+/, '');
  
  // Limit length
  const extension = sanitized.substring(sanitized.lastIndexOf('.'));
  const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
  
  if (nameWithoutExt.length > 100) {
    sanitized = nameWithoutExt.substring(0, 100) + extension;
  }
  
  return sanitized || `file_${Date.now()}${extension}`;
}

/**
 * Generate secure file path for storage
 */
export function generateSecureFilePath(
  userId: string, 
  filename: string, 
  category: string
): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const sanitizedFilename = sanitizeFilename(filename);
  
  return `${category}/${userId}/${timestamp}_${randomSuffix}_${sanitizedFilename}`;
}

/**
 * Check if file content matches declared MIME type (basic check)
 */
export function getFileSignature(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const bytes = Array.from(uint8Array.slice(0, 8));
      const signature = bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
      resolve(signature);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(0, 8));
  });
}