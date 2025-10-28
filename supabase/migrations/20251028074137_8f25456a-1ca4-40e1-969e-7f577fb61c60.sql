-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'viewer', 'analyst');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'analyst' THEN 2
      WHEN 'viewer' THEN 3
    END
  LIMIT 1
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies on documents table to use authentication
DROP POLICY IF EXISTS "Public read access" ON public.documents;
DROP POLICY IF EXISTS "Auth users can insert" ON public.documents;

CREATE POLICY "Authenticated users can view documents"
ON public.documents
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can delete documents"
ON public.documents
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update RLS policies on strategic_insights_feedback
DROP POLICY IF EXISTS "Public read access" ON public.strategic_insights_feedback;
DROP POLICY IF EXISTS "Auth users can insert feedback" ON public.strategic_insights_feedback;

CREATE POLICY "Authenticated users can view feedback"
ON public.strategic_insights_feedback
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert feedback"
ON public.strategic_insights_feedback
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create trigger for updated_at on user_roles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Make documents bucket private via storage policies
DROP POLICY IF EXISTS "Public access for documents" ON storage.objects;

CREATE POLICY "Authenticated users can view documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Admins can delete documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  public.has_role(auth.uid(), 'admin')
);

-- Keep vehicle-images bucket public (for public dashboard display)
CREATE POLICY "Public can view vehicle images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'vehicle-images');