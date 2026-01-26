-- Create slides table for slideshow configuration
CREATE TABLE public.slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weather', 'iframe', 'announcement')),
  url TEXT, -- URL for iframe type
  content TEXT, -- Content for announcement type
  duration INTEGER NOT NULL DEFAULT 60, -- Duration in seconds
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for display on TV/monitors)
CREATE POLICY "Slides are publicly readable" 
ON public.slides 
FOR SELECT 
USING (true);

-- Create policy for public write access (for admin settings - in production, restrict this)
CREATE POLICY "Anyone can manage slides" 
ON public.slides 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_slides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_slides_updated_at
BEFORE UPDATE ON public.slides
FOR EACH ROW
EXECUTE FUNCTION public.update_slides_updated_at();

-- Insert default weather slide
INSERT INTO public.slides (title, type, duration, order_index, is_active)
VALUES ('สภาพอากาศ', 'weather', 60, 0, true);