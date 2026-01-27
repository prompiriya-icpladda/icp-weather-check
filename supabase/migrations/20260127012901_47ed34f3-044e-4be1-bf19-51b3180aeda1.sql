-- Create storage bucket for announcement files
INSERT INTO storage.buckets (id, name, public)
VALUES ('announcements', 'announcements', true);

-- Allow public read access to announcement files
CREATE POLICY "Public read access for announcements"
ON storage.objects FOR SELECT
USING (bucket_id = 'announcements');

-- Allow anyone to upload announcement files
CREATE POLICY "Anyone can upload announcements"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'announcements');

-- Allow anyone to delete announcement files
CREATE POLICY "Anyone can delete announcements"
ON storage.objects FOR DELETE
USING (bucket_id = 'announcements');

-- Add file_url column to slides table for image/PDF announcements
ALTER TABLE public.slides
ADD COLUMN file_url TEXT DEFAULT NULL;

-- Add file_type column to distinguish between image and pdf
ALTER TABLE public.slides
ADD COLUMN file_type TEXT DEFAULT NULL;