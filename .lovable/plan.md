

# Plan: Fix Access Control, Link Modules, and Enable Profile Picture Uploads

## What This Plan Does

1. **Create a storage bucket** for profile image uploads (currently no buckets exist, so uploads fail)
2. **Fix the profile save flow** to actually persist profile image URLs to the database (currently `handleSave` only shows a toast but never updates the `users` table or refreshes the auth context)
3. **Update the Header** to show profile images (currently only shows initials)
4. **Add DAAS cards to the Dashboard** so DAAS users see their relevant quick-access cards (Aerodrome Certifications, Safety Inspections, Personnel)
5. **Verify sidebar access** -- the sidebar already correctly filters by directorate, but the Dashboard's `navigationCards` is missing DAAS-specific entries

## Technical Details

### Step 1: Database Migration - Create Storage Bucket
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Allow anyone to upload avatars
CREATE POLICY "Allow avatar uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Allow avatar reads" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Allow avatar updates" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
CREATE POLICY "Allow avatar deletes" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');
```

### Step 2: Fix ProfilePage.tsx
- Change storage bucket from `'documents'` to `'avatars'`
- Update `handleSave` to actually call `supabase.from('users').update(...)` with the new profile image URL, name, phone number
- After saving, update localStorage auth state so the profile image persists across the session
- Add a `refreshUser` method to AuthContext that reloads user data from DB

### Step 3: Update AuthContext.tsx
- Add a `refreshUser()` function that re-fetches the user from the DB and updates state + localStorage
- Export it so ProfilePage and Header can use it

### Step 4: Update Header.tsx
- Import `AvatarImage` and show the user's `profileImage` if available, falling back to initials

### Step 5: Update Dashboard.tsx
- Add DAAS-specific navigation cards (Aerodrome Certifications, Safety Inspections, Personnel) with counts from the database
- These cards should only be visible to DAAS directorate users and Super Users
- Ensure the "Economic Licenses" card links to `/economic-license/paas` (first sub-page) instead of `/economic-license` which doesn't exist as a route

### Files Changed
- `supabase/migrations/` -- new migration for avatars bucket
- `src/context/AuthContext.tsx` -- add `refreshUser()`
- `src/pages/ProfilePage.tsx` -- fix save + upload bucket
- `src/components/Header.tsx` -- show profile image
- `src/pages/Dashboard.tsx` -- add DAAS cards, fix Economic License link

