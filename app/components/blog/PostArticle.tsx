import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/lib/types';

/**
 * Shared post renderer - used by the public /blog/[slug] page and the admin draft preview.
 * Reading order: cover image → title → byline → body.
 */
export default function PostArticle({ post }: { post: Post }) {
  return (
    <article className="mx-auto w-full max-w-[760px]">
      {post.cover_image_url && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden border border-border">
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

      <header>
        <h1 className="heading-xl text-text-primary">{post.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
          <span className="text-text-secondary">{post.author}</span>
          <span aria-hidden className="text-text-faint">·</span>
          <time dateTime={post.published_at ?? post.created_at}>{formatDate(post.published_at ?? post.created_at)}</time>
          {post.tags.map((tag) => (
            <span key={tag} className="text-crimson">#{tag}</span>
          ))}
        </div>
      </header>

      {/* content_html is sanitized server-side at save time (see actions/posts.ts) */}
      <div className="prose-blog mt-12" dangerouslySetInnerHTML={{ __html: post.content_html }} />
    </article>
  );
}
