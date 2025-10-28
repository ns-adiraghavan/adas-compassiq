-- Fix csv_data table unrestricted access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on csv_data" ON csv_data;

-- Create read-only policy for public access (reference data)
CREATE POLICY "Public can view csv_data" ON csv_data
  FOR SELECT 
  USING (true);

-- Create admin-only policy for data management
CREATE POLICY "Admins can manage csv_data" ON csv_data
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));