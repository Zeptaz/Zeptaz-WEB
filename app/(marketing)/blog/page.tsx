import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts, getAllTags } from '@/lib/blog';
import { cn } from '@/lib/utils';
import PageHero from '@/components/ui/PageHero';
import CtaBand from '@/components/ui/CtaBand';
import PostCard from '@/components/blog/PostCard';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog - Zeptaz',
  description:
    'Operator notes from the Zeptaz team: workflow leak lessons, automation patterns, and what actually breaks inside service businesses. No fluff.',
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const [posts, tags] = await Promise.all([getPublishedPosts(tag), getAllTags()]);

  return (
    <>
      <PageHero
        eyebrow="Operator Notes"
        title="Workflow lessons, no fluff."
        lead="What we learn building automation inside real service businesses: where work leaks, what actually breaks, and the boring systems that fix it."
      />

      <section data-nav="dark" className="section-dark relative border-t border-border py-20">
        <div className="section-shell">
          {tags.length > 0 && (
            <div className="mb-12 flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">Filter</span>
              <Link
                href="/blog"
                className={cn(
                  'border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors',
                  !tag ? 'border-crimson text-crimson' : 'border-border text-text-muted hover:border-border-strong hover:text-text-secondary',
                )}
              >
                All
              </Link>
              {tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className={cn(
                    'border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors',
                    tag === t ? 'border-crimson text-crimson' : 'border-border text-text-muted hover:border-border-strong hover:text-text-secondary',
                  )}
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="border border-border bg-bg-subtle/40 p-16 text-center">
              <p className="mono-meta text-text-muted">
                {tag ? `No posts tagged #${tag} yet.` : 'First posts are on the way - check back soon.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand title="Stop reading about leaks. Fix yours." />
    </>
  );
}
