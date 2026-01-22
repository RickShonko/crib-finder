-- Create enum for house types
CREATE TYPE public.house_type AS ENUM ('bedsitter', 'one_bedroom', 'two_bedroom', 'shared');

-- Create enum for availability status
CREATE TYPE public.availability_status AS ENUM ('available', 'taken');

-- Create profiles table for landlords
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create houses table
CREATE TABLE public.houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  rent_price INTEGER NOT NULL,
  deposit_amount INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL,
  house_type house_type NOT NULL DEFAULT 'bedsitter',
  is_furnished BOOLEAN NOT NULL DEFAULT false,
  availability availability_status NOT NULL DEFAULT 'available',
  photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  contact_phone TEXT NOT NULL,
  whatsapp_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Houses policies
CREATE POLICY "Houses are viewable by everyone" 
ON public.houses FOR SELECT USING (true);

CREATE POLICY "Landlords can insert their own houses" 
ON public.houses FOR INSERT 
WITH CHECK (landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Landlords can update their own houses" 
ON public.houses FOR UPDATE 
USING (landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Landlords can delete their own houses" 
ON public.houses FOR DELETE 
USING (landlord_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_houses_updated_at
BEFORE UPDATE ON public.houses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for house photos
INSERT INTO storage.buckets (id, name, public) VALUES ('house-photos', 'house-photos', true);

-- Storage policies for house photos
CREATE POLICY "Anyone can view house photos" 
ON storage.objects FOR SELECT USING (bucket_id = 'house-photos');

CREATE POLICY "Authenticated users can upload house photos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'house-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own house photos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'house-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own house photos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'house-photos' AND auth.role() = 'authenticated');