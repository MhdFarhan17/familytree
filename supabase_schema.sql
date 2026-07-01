-- 1. Buat tabel family_members
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  nickname TEXT NOT NULL,
  birth_date DATE NOT NULL,
  death_date DATE,
  is_deceased BOOLEAN DEFAULT FALSE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  photo_url TEXT,
  father_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  mother_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  spouse_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Buat Storage Bucket untuk foto profil
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- 3. Atur kebijakan keamanan (RLS) untuk tabel family_members
-- Untuk prototipe ini, kita izinkan akses penuh baca/tulis tanpa login otentikasi (anon access)
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access" 
  ON family_members FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" 
  ON family_members FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" 
  ON family_members FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete access" 
  ON family_members FOR DELETE USING (true);

-- 4. Atur kebijakan keamanan (RLS) untuk Storage avatars
CREATE POLICY "Avatar images are publicly accessible." 
  ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar." 
  ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can update an avatar." 
  ON storage.objects FOR UPDATE USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can delete an avatar." 
  ON storage.objects FOR DELETE USING ( bucket_id = 'avatars' );
