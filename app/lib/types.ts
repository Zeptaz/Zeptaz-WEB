/** Blog post row - mirrors public.posts in supabase/schema.sql. */
export type PostStatus = 'draft' | 'published';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_json: Record<string, unknown>;
  content_html: string;
  cover_image_url: string | null;
  tags: string[];
  status: PostStatus;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Fields the editor saves - everything the admin can set on a post. */
export type PostInput = Pick<
  Post,
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'content_json'
  | 'content_html'
  | 'cover_image_url'
  | 'tags'
  | 'meta_title'
  | 'meta_description'
  | 'og_image_url'
>;

/** Slim shape for the /blog listing (no post body). */
export type PostSummary = Omit<Post, 'content_json' | 'content_html'>;
