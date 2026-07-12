'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Pencil, Eye, Trash2 } from 'lucide-react';
import { deletePost } from '@/lib/actions/posts';
import { cn, formatDate } from '@/lib/utils';
import type { PostSummary } from '@/lib/types';

export default function PostsTable({ posts }: { posts: PostSummary[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onDelete = (post: PostSummary) => {
    if (!confirm(`Delete "${post.title || 'Untitled'}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deletePost(post.id);
      router.refresh();
    });
  };

  if (posts.length === 0) {
    return (
      <div className="border border-border bg-bg-subtle/50 p-12 text-center">
        <p className="mono-meta text-text-muted">No posts yet - write the first one.</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto border border-border', pending && 'opacity-60')}>
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-border bg-bg-subtle/60">
            <th className="px-5 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-text-muted">Title</th>
            <th className="px-5 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-text-muted">Status</th>
            <th className="px-5 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-text-muted">Tags</th>
            <th className="px-5 py-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-text-muted">Updated</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-border/60 last:border-b-0 hover:bg-bg-subtle/40">
              <td className="px-5 py-4">
                <Link href={`/admin/edit/${post.id}`} className="text-[14px] font-semibold text-text-primary transition-colors hover:text-crimson">
                  {post.title || <span className="italic text-text-muted">Untitled</span>}
                </Link>
                <div className="mt-0.5 font-mono text-[11px] text-text-faint">/{post.slug}</div>
              </td>
              <td className="px-5 py-4">
                <span
                  className={cn(
                    'px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]',
                    post.status === 'published' ? 'bg-terminal-green/10 text-terminal-green' : 'bg-bg-elevated text-text-muted',
                  )}
                >
                  {post.status}
                </span>
              </td>
              <td className="px-5 py-4 font-mono text-[11px] text-text-muted">{post.tags.join(', ') || '—'}</td>
              <td className="px-5 py-4 font-mono text-[11px] text-text-muted">{formatDate(post.updated_at)}</td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/edit/${post.id}`} className="p-2 text-text-muted transition-colors hover:text-crimson" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <Link
                    href={post.status === 'published' ? `/blog/${post.slug}` : `/admin/preview/${post.id}`}
                    target="_blank"
                    className="p-2 text-text-muted transition-colors hover:text-crimson"
                    aria-label="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button onClick={() => onDelete(post)} className="p-2 text-text-muted transition-colors hover:text-crimson" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
