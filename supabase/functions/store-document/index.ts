
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Allowed file types for upload
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain'
];

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileName, fileType, fileContent, fileSize } = await req.json();
    
    // Validate required fields
    if (!fileName || !fileType || !fileContent) {
      throw new Error('Missing required fields: fileName, fileType, or fileContent');
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      throw new Error(`Invalid file type: ${fileType}. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
    }

    // Validate file size
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Sanitize file name - remove path traversal characters and dangerous chars
    const sanitizedFileName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/^\.+/, '') // Remove leading dots
      .substring(0, 255); // Limit length
    
    if (!sanitizedFileName) {
      throw new Error('Invalid file name after sanitization');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Convert base64 to binary data
    const binaryData = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0));
    
    // Use sanitized filename with uploads/ prefix
    const filePath = `uploads/${sanitizedFileName}`;

    // Upload file to Supabase Storage with original name
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, binaryData, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: true // Allow overwriting files with same name
      });

    if (uploadError) {
      throw uploadError;
    }

    // Store file metadata in database with sanitized filename
    const { data, error } = await supabase
      .from('documents')
      .insert({
        file_name: sanitizedFileName,
        file_type: fileType,
        file_size: fileSize || 0,
        file_path: uploadData.path,
        storage_path: uploadData.path,
        metadata: {
          upload_timestamp: new Date().toISOString(),
          original_name: fileName,
          sanitized_name: sanitizedFileName,
          storage_bucket: 'documents',
          uploaded_via: 'edge_function'
        }
      })
      .select()
      .single();

    if (error) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('documents').remove([uploadData.path]);
      throw error;
    }

    console.log('Document stored successfully:', sanitizedFileName);

    return new Response(
      JSON.stringify({
        success: true,
        id: data.id,
        fileName: sanitizedFileName,
        originalFileName: fileName,
        fileType,
        fileSize,
        storagePath: uploadData.path,
        message: 'Document stored successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in store-document function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: 'Failed to store document in storage'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
