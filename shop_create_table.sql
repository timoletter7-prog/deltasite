-- Create shop table for storing available items
CREATE TABLE IF NOT EXISTS public.shop (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    description TEXT,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.shop ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON public.shop
AS PERMISSIVE FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow read operations for anonymous users
CREATE POLICY "Enable read access for all users" ON public.shop
AS PERMISSIVE FOR SELECT
TO anon
USING (true);
