-- ==========================================
-- SHREE RK PHOTO STUDIO: PRINT ORDERS SCHEMA
-- ==========================================

-- 1. Create the print_orders table
CREATE TABLE IF NOT EXISTS public.print_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT NOT NULL, -- Stores the Firebase Auth UID
    items JSONB NOT NULL,      -- Stores array of print items (size, qty, price)
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (RLS) on the table
ALTER TABLE public.print_orders ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies for print_orders
-- Since customers use Firebase Auth, they act as "anon" public users to Supabase.
-- We must allow public inserts so they can place orders from the frontend.
CREATE POLICY "Allow public inserts for print orders" ON public.print_orders
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow Studio Admins (who log in via Supabase Auth) full access to view/update all orders
CREATE POLICY "Admin full access print_orders" ON public.print_orders
    FOR ALL
    TO authenticated
    USING (auth.role() = 'authenticated');


-- ==========================================
-- STORAGE BUCKET CONFIGURATION
-- ==========================================

-- 3. Set up Storage Bucket for high-res customer photo uploads
-- This creates the 'customer-uploads' bucket if it doesn't already exist.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('customer-uploads', 'customer-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 4. RLS Policies for the Storage Bucket
-- Allow anonymous users (Firebase customers) to upload files into this bucket
CREATE POLICY "Allow public uploads to customer-uploads" ON storage.objects
    FOR INSERT 
    TO public
    WITH CHECK (bucket_id = 'customer-uploads');

-- Allow Studio Admins full read/write/delete access to the bucket
CREATE POLICY "Admin full access to customer-uploads" ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'customer-uploads' AND auth.role() = 'authenticated');
