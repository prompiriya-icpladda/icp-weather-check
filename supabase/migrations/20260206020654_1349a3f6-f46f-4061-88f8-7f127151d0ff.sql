-- Fix security issues: Restrict slides management and storage access to authenticated admins only

-- Drop the overly permissive slides policy
DROP POLICY IF EXISTS "Anyone can manage slides" ON public.slides;

-- Create admin-only write policies for slides using has_role function
CREATE POLICY "Admins can manage slides"
ON public.slides
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop permissive storage policies
DROP POLICY IF EXISTS "Anyone can upload announcements" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete announcements" ON storage.objects;

-- Create admin-only storage policies
CREATE POLICY "Admins can upload announcements"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'announcements' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete announcements"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'announcements' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update announcements"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'announcements' AND
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'announcements' AND
  public.has_role(auth.uid(), 'admin')
);