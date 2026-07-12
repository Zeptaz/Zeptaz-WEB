import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/types';

/** Shared post renderer - used by the public /blog/[slug] page and the admin draft preview. */
export default function PostArticle({ post }: { post: Post }) {
  return (
    <article className="mx-auto w-full max-w-[760px]">
      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
          <time dateTime={post.published_at ?? post.created_at}>{formatDate(post.published_at ?? post.created_at)}</time>
          {post.tags.map((tag) => (
            <span key={tag} className="text-crimson">#{tag}</span>
          ))}
        </div>
        <h1 className="heading-xl mt-5 text-text-primary">{post.title}</h1>
        {post.excerpt && <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary">{post.excerpt}</p>}
      </header>

      {post.cover_image_url && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-border">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 820px) 100vw, 760px"
            priority
          />
        </div>
      )}

      {/* content_html is sanitized server-side at save time (see actions/posts.ts) */}
      <div className="prose-blog mt-12" dangerouslySetInnerHTML={{ __html: post.content_html }} />
    </article>
  );
}
