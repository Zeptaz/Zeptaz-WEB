import { createClient } from '@/lib/supabase/client';

/**
 * Browser → Supabase Storage direct upload (no server hop for binary data).
 * Requires an authenticated session - Storage RLS rejects anonymous writes.
 * Returns the public URL of the uploaded image.
 */
export async function uploadBlogImage(file: File, prefix: string): Promise<string> {
  const supabase = createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${prefix}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from('blog-images').upload(path, file);
  if (error) throw new Error(error.message);
  return supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
}
