-- Create storage bucket for host images if not exists
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'host_images'
  ) then
    insert into storage.buckets (id, name, public)
    values ('host_images', 'host_images', true);
  end if;
end $$;

-- Create storage bucket for user profile images if not exists
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'user-images'
  ) then
    insert into storage.buckets (id, name, public)
    values ('user-images', 'user-images', true);
  end if;
end $$;

-- Add image_urls column to host_applications to store array of image URLs
alter table if exists public.host_applications
  add column if not exists image_urls text[] default '{}'::text[];

-- Public read access to host_images (optional: keep public to render in app)
-- Adjust policies as needed for your environment
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read access to host_images'
  ) then
    create policy "Public read access to host_images"
      on storage.objects for select
      using (bucket_id = 'host_images');
  end if;
end $$;

-- Allow authenticated users to insert into host_images
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload to host_images'
  ) then
    create policy "Authenticated users can upload to host_images"
      on storage.objects for insert to authenticated
      with check (bucket_id = 'host_images');
  end if;
end $$;

-- Public read access to user-images (for profile pictures)
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read access to user-images'
  ) then
    create policy "Public read access to user-images"
      on storage.objects for select
      using (bucket_id = 'user-images');
  end if;
end $$;

-- Allow authenticated users to upload to user-images
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload to user-images'
  ) then
    create policy "Authenticated users can upload to user-images"
      on storage.objects for insert to authenticated
      with check (bucket_id = 'user-images');
  end if;
end $$;

-- Allow users to update their own profile images
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can update their own profile images'
  ) then
    create policy "Users can update their own profile images"
      on storage.objects for update to authenticated
      using (bucket_id = 'user-images' and auth.uid()::text = (storage.foldername(name))[1])
      with check (bucket_id = 'user-images' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;
end $$;

-- Allow users to delete their own profile images
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can delete their own profile images'
  ) then
    create policy "Users can delete their own profile images"
      on storage.objects for delete to authenticated
      using (bucket_id = 'user-images' and auth.uid()::text = (storage.foldername(name))[1]);
  end if;
end $$;


