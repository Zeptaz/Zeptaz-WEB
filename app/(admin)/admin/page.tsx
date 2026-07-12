import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createPost } from '@/lib/actions/posts';
import PostsTable from '@/components/admin/PostsTable';
import type { PostSummary } from '@/lib/types';

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image_url, tags, status, meta_title, meta_description, og_image_url, published_at, created_at, updated_at')
    .order('updated_at', { ascending: false });
  const posts = (data ?? []) as PostSummary[];

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="mono-meta text-crimson">Blog</div>
          <h1 className="heading-xl mt-2 text-text-primary">Posts</h1>
        </div>
        {/* form action (not a link) so prefetching can never create stray drafts */}
        <form action={createPost}>
          <button type="submit" className="btn btn-primary">
            New post <Plus className="h-4 w-4" />
          </button>
        </form>
      </div>
      <PostsTable posts={posts} />
    </>
  );
}
