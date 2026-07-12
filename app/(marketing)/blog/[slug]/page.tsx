import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug, getPublishedSlugs } from '@/lib/blog';
import { SITE } from '@/lib/constants';
import CtaBand from '@/components/ui/CtaBand';
import PostArticle from '@/components/blog/PostArticle';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = post.meta_title ?? post.title;
  const description = post.meta_description ?? post.excerpt;
  const ogImage = post.og_image_url ?? post.cover_image_url;
  return {
    title: `${title} - ${SITE.name}`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description ?? post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
  };

  return (
    <>
      <section data-nav="dark" className="section-dark relative border-b border-border pb-24 pt-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,20,60,0.07), transparent 60%)' }}
        />
        <div className="section-shell relative">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-crimson"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All posts
          </Link>
          <PostArticle post={post} />
        </div>
      </section>

      <CtaBand title="See your workflow automated." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
