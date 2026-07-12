import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import PostArticle from '@/components/blog/PostArticle';
import type { Post } from '@/lib/types';

/** Draft preview - same PostArticle renderer as the public page, behind auth. */
export default async function PreviewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const post = data as Post;

  return (
    <div>
      <div className="mb-10 flex items-center justify-between border border-border bg-bg-subtle/60 px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
          Preview · <span className={post.status === 'published' ? 'text-terminal-green' : 'text-crimson'}>{post.status}</span>
        </span>
        <Link
          href={`/admin/edit/${post.id}`}
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-crimson"
        >
          <Pencil className="h-3.5 w-3.5" /> Back to editor
        </Link>
      </div>
      <PostArticle post={post} />
    </div>
  );
}
