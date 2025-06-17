
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents', 
  'documents', 
  true, 
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/webm',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    'text/plain',
    'application/json',
    'application/xml'
  ]
);

-- Create policies for the documents bucket
CREATE POLICY "Public can view documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Public can upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public can update documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents');

CREATE POLICY "Public can delete documents" ON storage.objects
FOR DELETE USING (bucket_id = 'documents');

-- Update the documents table to store file path instead of binary content
ALTER TABLE public.documents 
DROP COLUMN file_content,
ADD COLUMN file_path TEXT NOT NULL DEFAULT '',
ADD COLUMN storage_path TEXT;

-- Add index for better performance
CREATE INDEX idx_documents_file_path ON public.documents(file_path);
