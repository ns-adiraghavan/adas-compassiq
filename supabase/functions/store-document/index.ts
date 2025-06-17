
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
    
    // Store the document in the database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        file_name: fileName,
        file_type: fileType,
        file_content: binaryData,
        file_size: fileSize || 0,
        metadata: {
          upload_timestamp: new Date().toISOString(),
          original_name: fileName
        }
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Document stored successfully:', fileName);

    return new Response(
      JSON.stringify({
        success: true,
        id: data.id,
        fileName,
        fileType,
        fileSize,
        message: 'Document stored successfully'
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
        details: 'Failed to store document'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
