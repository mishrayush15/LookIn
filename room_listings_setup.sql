-- Run this SQL in Supabase SQL Editor to create the room listings table

-- Room Listings table: stores room listings posted by users
CREATE TABLE IF NOT EXISTS room_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  city_id TEXT,
  city_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  room_type TEXT NOT NULL,
  rent INTEGER NOT NULL,
  deposit INTEGER NOT NULL,
  available_from DATE NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  flatmate_preferences TEXT[] DEFAULT '{}',
  house_rules TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  inquiries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_room_listings_user_id ON room_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_room_listings_city ON room_listings(city_name);
CREATE INDEX IF NOT EXISTS idx_room_listings_active ON room_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_room_listings_created ON room_listings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE room_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for room_listings
-- Users can view all active listings
CREATE POLICY "Anyone can view active listings" ON room_listings
  FOR SELECT USING (is_active = TRUE);

-- Users can view their own listings (active or inactive)
CREATE POLICY "Users can view own listings" ON room_listings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own listings
CREATE POLICY "Users can create own listings" ON room_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings" ON room_listings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings" ON room_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_room_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_room_listings_updated_at
  BEFORE UPDATE ON room_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_room_listings_updated_at();

-- Function to increment views when listing is viewed
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE room_listings
  SET views = views + 1
  WHERE id = listing_id;
END;
$$ language 'plpgsql';

-- Function to increment inquiries when someone contacts about listing
CREATE OR REPLACE FUNCTION increment_listing_inquiries(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE room_listings
  SET inquiries = inquiries + 1
  WHERE id = listing_id;
END;
$$ language 'plpgsql';


