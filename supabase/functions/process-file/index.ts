import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    
    if (!file) {
      throw new Error('No file provided');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log('Processing file:', file.name, file.type, file.size);

    // Initialize Supabase client first for validation
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Enhanced server-side validation using the database function
    const { data: validationResult, error: validationError } = await supabase
      .rpc('validate_file_upload', {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        user_id: userId
      });

    if (validationError) {
      console.error('Validation error:', validationError);
      throw new Error('File validation failed');
    }

    if (!validationResult.valid) {
      const errorDetails = validationResult.errors.join(', ');
      throw new Error(`File validation failed: ${errorDetails}`);
    }

    console.log('File validation passed');

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}-${file.name}`;

    // Upload to Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(fileName);

    // Convert file to base64 for n8n
    const uint8Array = new Uint8Array(fileBuffer);
    const base64File = btoa(String.fromCharCode(...uint8Array));

    const fileInfo = {
      id: uploadData.id,
      name: file.name,
      type: file.type,
      size: file.size,
      url: urlData.publicUrl,
      base64: base64File,
      uploadPath: fileName
    };

    // Log successful upload for security monitoring
    await supabase.rpc('log_security_event', {
      event_type: 'file_upload_success',
      target_user_id: userId,
      event_details: {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        upload_path: fileName
      },
      event_severity: 'info'
    });

    console.log('File processed successfully:', fileInfo.name);

    return new Response(
      JSON.stringify({ file: fileInfo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-file function:', error);
    
    // Determine status code based on error type
    let statusCode = 500;
    let errorMessage = error.message || 'Unknown error occurred';
    
    if (errorMessage.includes('File type') || errorMessage.includes('File size')) {
      statusCode = 400; // Bad Request for validation errors
    } else if (errorMessage.includes('No file') || errorMessage.includes('User ID is required')) {
      statusCode = 400; // Bad Request for missing required fields
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.stack || 'No additional details available'
      }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});