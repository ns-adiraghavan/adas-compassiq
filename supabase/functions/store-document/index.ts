
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    
    if (!fileName || !fileType || !fileContent) {
      throw new Error('Missing required fields: fileName, fileType, or fileContent');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Convert base64 to binary data
    const binaryData = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0));
    
    // Generate unique file path
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}_${randomId}.${fileExtension}`;
    const filePath = `uploads/${uniqueFileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, binaryData, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Store file metadata in database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize || 0,
        file_path: uploadData.path,
        storage_path: uploadData.path,
        metadata: {
          upload_timestamp: new Date().toISOString(),
          original_name: fileName,
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

    console.log('Document stored successfully in storage:', fileName);

    return new Response(
      JSON.stringify({
        success: true,
        id: data.id,
        fileName,
        fileType,
        fileSize,
        storagePath: uploadData.path,
        message: 'Document stored successfully in Supabase Storage'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in store-document function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: 'Failed to store document in storage'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
