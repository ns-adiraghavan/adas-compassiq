
-- Create a new documents table to store files directly
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_content BYTEA NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add Row Level Security (RLS) - making it public for now for simplicity
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (you can modify this later for user-specific access)
CREATE POLICY "Public can view documents" 
  ON public.documents 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public can upload documents" 
  ON public.documents 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update documents" 
  ON public.documents 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Public can delete documents" 
  ON public.documents 
  FOR DELETE 
  USING (true);
