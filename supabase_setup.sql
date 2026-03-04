-- ==========================================
-- SHREE RK PHOTO STUDIO: PRINT ORDERS SCHEMA
-- ==========================================

-- 1. Create the print_orders table
CREATE TABLE IF NOT EXISTS public.print_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT NOT NULL,
    customer_email TEXT,
    items JSONB NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'printing', 'ready', 'delivered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.print_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts for print orders" ON public.print_orders;
DROP POLICY IF EXISTS "Customers view own orders" ON public.print_orders;
DROP POLICY IF EXISTS "Authenticated users view all orders" ON public.print_orders;
DROP POLICY IF EXISTS "Admin full access print_orders" ON public.print_orders;

-- Create new policies
CREATE POLICY "Allow public inserts for print orders" ON public.print_orders
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Customers view own orders" ON public.print_orders
    FOR SELECT TO public USING (customer_id IS NOT NULL);

CREATE POLICY "Authenticated users view all orders" ON public.print_orders
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin full access print_orders" ON public.print_orders
    FOR ALL TO authenticated USING (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE BUCKET
-- ==========================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('customer-uploads', 'customer-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public uploads to customer-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read customer-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users view all files" ON storage.objects;
DROP POLICY IF EXISTS "Admin full access to customer-uploads" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Allow public uploads to customer-uploads" ON storage.objects
    FOR INSERT TO public WITH CHECK (bucket_id = 'customer-uploads');

CREATE POLICY "Allow public read customer-uploads" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'customer-uploads');

CREATE POLICY "Authenticated users view all files" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'customer-uploads');

CREATE POLICY "Admin full access to customer-uploads" ON storage.objects
    FOR ALL TO authenticated USING (bucket_id = 'customer-uploads' AND auth.role() = 'authenticated');
