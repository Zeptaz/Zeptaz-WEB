'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import { createClient } from '@/lib/supabase/server';
import type { Post, PostInput } from '@/lib/types';

/** Every mutation runs behind this - RLS is the backstop, this is the front door. */
async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return supabase;
}

/**
 * Sanitized at save time (not render time) so the public site can trust
 * content_html. Allowlist mirrors exactly what the editor can produce.
 */
function sanitizeContent(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ['h2', 'h3', 'h4', 'p', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'img', 'hr', 'br'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      code: ['class'],
      img: ['src', 'alt', 'width', 'height'],
    },
    allowedSchemes: ['https', 'http'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}

function revalidateBlog(slug?: string) {
  revalidatePath('/blog');
  if (slug) revalidatePath(`/blog/${slug}`);
}

/** Insert a blank draft and jump straight into the editor. */
export async function createPost() {
  const supabase = await requireAuth();
  const { data, error } = await supabase
    .from('posts')
    .insert({ slug: `draft-${Date.now()}` })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  redirect(`/admin/edit/${data.id}`);
}

export type SaveResult = { ok: true } | { ok: false; error: string; field?: 'slug' };

export async function updatePost(id: string, input: PostInput): Promise<SaveResult> {
  const supabase = await requireAuth();
  const { data, error } = await supabase
    .from('posts')
    .update({ ...input, content_html: sanitizeContent(input.content_html) })
    .eq('id', id)
    .select('slug, status')
    .single();
  if (error) {
    if (error.code === '23505') return { ok: false, error: 'That slug is already taken.', field: 'slug' };
    return { ok: false, error: error.message };
  }
  // editing a live post should show up on the public site right away
  if ((data as Pick<Post, 'slug' | 'status'>).status === 'published') revalidateBlog(data.slug);
  return { ok: true };
}

export async function publishPost(id: string): Promise<SaveResult> {
  const supabase = await requireAuth();
  const { data: existing } = await supabase.from('posts').select('published_at').eq('id', id).single();
  const { data, error } = await supabase
    .from('posts')
    .update({ status: 'published', published_at: existing?.published_at ?? new Date().toISOString() })
    .eq('id', id)
    .select('slug')
    .single();
  if (error) return { ok: false, error: error.message };
  revalidateBlog(data.slug);
  return { ok: true };
}

export async function unpublishPost(id: string): Promise<SaveResult> {
  const supabase = await requireAuth();
  const { data, error } = await supabase
    .from('posts')
    .update({ status: 'draft' })
    .eq('id', id)
    .select('slug')
    .single();
  if (error) return { ok: false, error: error.message };
  revalidateBlog(data.slug);
  return { ok: true };
}

export async function deletePost(id: string) {
  const supabase = await requireAuth();
  const { data, error } = await supabase.from('posts').delete().eq('id', id).select('slug').single();
  if (error) throw new Error(error.message);
  revalidateBlog(data.slug);
  revalidatePath('/admin');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
