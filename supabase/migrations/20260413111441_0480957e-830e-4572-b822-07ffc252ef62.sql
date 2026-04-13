INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Allow avatar uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Allow avatar reads" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Allow avatar updates" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
CREATE POLICY "Allow avatar deletes" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');