'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, LoaderCircle, Save, Send, Undo2 } from 'lucide-react';
import { updatePost, publishPost, unpublishPost } from '@/lib/actions/posts';
import { cn, slugify } from '@/lib/utils';
import type { Post, PostInput, PostStatus } from '@/lib/types';
import RichTextEditor from './RichTextEditor';
import PostSettingsPanel, { type PostFormPatch } from './PostSettingsPanel';

export default function PostEditorShell({ post }: { post: Post }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post.title,
    slug: post.slug,
    author: post.author,
    excerpt: post.excerpt,
    tags: post.tags,
    cover_image_url: post.cover_image_url,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    og_image_url: post.og_image_url,
  });
  // fresh drafts get an auto slug from the title until the admin opts out
  const [slugSynced, setSlugSynced] = useState(post.slug.startsWith('draft-'));
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<'save' | 'preview' | 'publish' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // content lives in a ref - re-rendering the whole shell per keystroke is wasteful
  const content = useRef({ json: post.content_json, html: post.content_html });

  const update = (patch: PostFormPatch) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  };

  const onTitleChange = (title: string) => {
    update(slugSynced ? { title, slug: slugify(title) || form.slug } : { title });
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const buildInput = (): PostInput => ({
    ...form,
    content_json: content.current.json,
    content_html: content.current.html,
  });

  const save = async (): Promise<boolean> => {
    setError(null);
    const res = await updatePost(post.id, buildInput());
    if (!res.ok) {
      setError(res.error);
      return false;
    }
    setDirty(false);
    return true;
  };

  const onSave = async () => {
    setBusy('save');
    await save();
    setBusy(null);
  };

  const onPreview = async () => {
    setBusy('preview');
    if (await save()) window.open(`/admin/preview/${post.id}`, '_blank');
    setBusy(null);
  };

  const onTogglePublish = async () => {
    setBusy('publish');
    if (await save()) {
      const res = status === 'published' ? await unpublishPost(post.id) : await publishPost(post.id);
      if (res.ok) {
        setStatus(status === 'published' ? 'draft' : 'published');
        router.refresh();
      } else {
        setError(res.error);
      }
    }
    setBusy(null);
  };

  const published = status === 'published';

  return (
    <div>
      {/* action bar */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-crimson"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Posts
        </Link>
        <span
          className={cn(
            'px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]',
            published ? 'bg-terminal-green/10 text-terminal-green' : 'bg-bg-elevated text-text-muted',
          )}
        >
          {status}
        </span>
        {dirty && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-crimson">Unsaved changes</span>}
        {error && <span className="font-mono text-[11px] text-crimson" role="alert">{error}</span>}

        <div className="ml-auto flex items-center gap-2.5">
          <button
            onClick={onSave}
            disabled={busy !== null}
            className="flex items-center gap-1.5 border border-border-strong px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-crimson hover:text-crimson disabled:opacity-50"
          >
            {busy === 'save' ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
          </button>
          <button
            onClick={onPreview}
            disabled={busy !== null}
            className="flex items-center gap-1.5 border border-border-strong px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:border-crimson hover:text-crimson disabled:opacity-50"
          >
            {busy === 'preview' ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />} Preview
          </button>
          <button onClick={onTogglePublish} disabled={busy !== null} className="btn btn-primary !px-4 !py-2.5 text-[10px] disabled:opacity-50">
            {busy === 'publish'
              ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              : published ? <Undo2 className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
            {published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* editor column */}
        <div>
          <textarea
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value.replace(/\n/g, ''))}
            placeholder="Post title"
            rows={1}
            className="heading-xl w-full resize-none overflow-hidden bg-transparent text-text-primary placeholder:text-text-faint focus:outline-none"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <div className="mt-6">
            <RichTextEditor
              postId={post.id}
              initialContent={typeof post.content_json?.type === 'string' ? post.content_json : undefined}
              onChange={(json, html) => {
                content.current = { json, html };
                setDirty(true);
              }}
            />
          </div>
        </div>

        <PostSettingsPanel
          postId={post.id}
          form={form}
          slugSynced={slugSynced}
          onSlugSyncedChange={setSlugSynced}
          update={update}
        />
      </div>
    </div>
  );
}
