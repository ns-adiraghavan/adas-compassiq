-- Fix storage bucket policies: Remove public DELETE and UPDATE operations
-- This prevents unauthenticated users from deleting or modifying documents
-- while still allowing read access for the mock auth setup

-- Drop the overly permissive public policies
DROP POLICY IF EXISTS "Public can delete documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload documents" ON storage.objects;

-- Also remove overly permissive policies from the documents table
DROP POLICY IF EXISTS "Public can delete documents" ON public.documents;
DROP POLICY IF EXISTS "Public can update documents" ON public.documents;

-- Keep read and authenticated insert access
-- (The existing "Authenticated users can insert documents" and 
-- "Authenticated users can view documents" policies remain)