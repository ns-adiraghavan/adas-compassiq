
-- Create a storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true);

-- Create policies for the vehicle-images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-images');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'vehicle-images');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'vehicle-images');
