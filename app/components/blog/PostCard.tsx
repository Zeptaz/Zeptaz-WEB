import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Reveal from '@/components/ui/Reveal';
import type { PostSummary } from '@/lib/types';

export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <Reveal>
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col border border-border bg-bg-subtle/40 transition-colors hover:border-border-strong"
      >
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-bg-elevated">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.22em] text-text-faint">
              Zeptaz
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
            <time dateTime={post.published_at ?? post.created_at}>{formatDate(post.published_at ?? post.created_at)}</time>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-crimson">#{tag}</span>
            ))}
          </div>
          <h2 className="heading-md mt-3 text-text-primary transition-colors group-hover:text-crimson">{post.title}</h2>
          {post.excerpt && <p className="mt-3 text-sm leading-relaxed text-text-secondary">{post.excerpt}</p>}
          <span className="mt-auto inline-flex items-center gap-1 pt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted transition-colors group-hover:text-crimson">
            Read post <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
