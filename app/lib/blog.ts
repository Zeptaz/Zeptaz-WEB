import { createPublicClient } from '@/lib/supabase/public';
import type { Post, PostSummary } from '@/lib/types';

const SUMMARY_FIELDS =
  'id, title, slug, author, excerpt, cover_image_url, tags, status, meta_title, meta_description, og_image_url, published_at, created_at, updated_at';

/** Published posts for the /blog listing, newest first; optional tag filter. */
export async function getPublishedPosts(tag?: string): Promise<PostSummary[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  let query = supabase
    .from('posts')
    .select(SUMMARY_FIELDS)
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (tag) query = query.contains('tags', [tag]);
  const { data, error } = await query;
  if (error) {
    console.error('[blog] getPublishedPosts:', error.message);
    return [];
  }
  return (data ?? []) as PostSummary[];
}

/** A single published post by slug (drafts are invisible to the anon client via RLS). */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) {
    console.error('[blog] getPostBySlug:', error.message);
    return null;
  }
  return data as Post | null;
}

/** Unique tags across published posts (blog scale - dedupe in JS is fine). */
export async function getAllTags(): Promise<string[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from('posts').select('tags').eq('status', 'published');
  if (error) {
    console.error('[blog] getAllTags:', error.message);
    return [];
  }
  const all = (data ?? []).flatMap((r: { tags: string[] }) => r.tags);
  return [...new Set(all)].sort();
}

/** Slugs for generateStaticParams on /blog/[slug]. */
export async function getPublishedSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase.from('posts').select('slug').eq('status', 'published');
  return (data ?? []).map((r: { slug: string }) => r.slug);
}
