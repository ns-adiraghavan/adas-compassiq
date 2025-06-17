
import { supabase } from "@/integrations/supabase/client"

export const storeImageInSupabase = async (imageUrl: string, fileName: string) => {
  try {
    // Fetch the image from the local URL
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    
    // Upload to Supabase storage in the documents bucket
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`images/${fileName}.png`, blob, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error(`Error uploading ${fileName}:`, error)
      throw error
    }

    // Store metadata in the documents table
    const { data: dbData, error: dbError } = await supabase
      .from('documents')
      .insert({
        file_name: `${fileName}.png`,
        file_type: 'image/png',
        file_size: blob.size,
        file_path: data.path,
        storage_path: data.path,
        metadata: {
          upload_timestamp: new Date().toISOString(),
          original_name: fileName,
          storage_bucket: 'documents',
          uploaded_via: 'manual_storage'
        }
      })

    if (dbError) {
      console.error('Error storing metadata:', dbError)
      // Don't throw here, the file was uploaded successfully
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path)

    console.log(`Image ${fileName} stored successfully at:`, urlData.publicUrl)
    
    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error(`Error storing image ${fileName}:`, error)
    throw error
  }
}
