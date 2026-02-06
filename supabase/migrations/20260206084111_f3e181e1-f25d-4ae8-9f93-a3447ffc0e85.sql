-- Create table for ticker messages
CREATE TABLE public.ticker_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ticker_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Ticker messages are publicly readable" 
ON public.ticker_messages 
FOR SELECT 
TO authenticated, anon
USING (true);

-- Create policy for admin management
CREATE POLICY "Admins can manage ticker messages" 
ON public.ticker_messages 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_ticker_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ticker_messages_updated_at
BEFORE UPDATE ON public.ticker_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_ticker_updated_at();