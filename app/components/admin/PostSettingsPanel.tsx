'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEAM } from '@/lib/constants';
import CoverImageField from './CoverImageField';
import type { PostInput } from '@/lib/types';

export type PostFormPatch = Partial<Omit<PostInput, 'content_json' | 'content_html'>>;

const inputClass =
  'w-full border border-border-strong bg-bg-primary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:border-crimson focus:outline-none';

function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState('');

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setDraft('');
  };

  return (
    <div>
      <div className="mono-meta mb-2 text-text-muted">Tags</div>
      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 border border-border bg-bg-elevated px-2 py-1 font-mono text-[11px] text-text-secondary">
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((t) => t !== tag))}
                className="text-text-muted transition-colors hover:text-crimson"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(draft);
          } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
            onChange(tags.slice(0, -1));
          }
        }}
        onBlur={() => draft.trim() && addTag(draft)}
        placeholder="Add a tag, press Enter"
        className={inputClass}
      />
    </div>
  );
}

export default function PostSettingsPanel({
  postId,
  form,
  slugSynced,
  onSlugSyncedChange,
  update,
}: {
  postId: string;
  form: Omit<PostInput, 'content_json' | 'content_html'>;
  slugSynced: boolean;
  onSlugSyncedChange: (v: boolean) => void;
  update: (patch: PostFormPatch) => void;
}) {
  const metaDescLen = (form.meta_description ?? '').length;

  return (
    <aside className="space-y-7">
      <CoverImageField
        label="Cover image"
        value={form.cover_image_url}
        prefix={`covers/${postId}`}
        onChange={(url) => update({ cover_image_url: url })}
      />

      <div>
        <label htmlFor="author" className="mono-meta mb-2 block text-text-muted">Author</label>
        {/* datalist = co-founders one click away, but a custom byline is still allowed */}
        <input
          id="author"
          list="author-options"
          value={form.author}
          onChange={(e) => update({ author: e.target.value })}
          placeholder="Zeptaz"
          className={inputClass}
        />
        <datalist id="author-options">
          <option value="Zeptaz" />
          {TEAM.map((m) => (
            <option key={m.name} value={m.name} />
          ))}
        </datalist>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="slug" className="mono-meta text-text-muted">Slug</label>
          <label className="flex cursor-pointer items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-text-faint">
            <input
              type="checkbox"
              checked={slugSynced}
              onChange={(e) => onSlugSyncedChange(e.target.checked)}
              className="accent-[#DC143C]"
            />
            Sync with title
          </label>
        </div>
        <div className="flex items-center">
          <span className="border border-r-0 border-border-strong bg-bg-elevated px-2.5 py-2.5 font-mono text-[12px] text-text-faint">/blog/</span>
          <input
            id="slug"
            value={form.slug}
            disabled={slugSynced}
            onChange={(e) => update({ slug: e.target.value })}
            className={cn(inputClass, 'font-mono text-[13px]', slugSynced && 'opacity-60')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="mono-meta mb-2 block text-text-muted">Excerpt</label>
        <textarea
          id="excerpt"
          rows={3}
          value={form.excerpt}
          onChange={(e) => update({ excerpt: e.target.value })}
          placeholder="One or two sentences for the listing card."
          className={cn(inputClass, 'resize-none')}
        />
      </div>

      <TagInput tags={form.tags} onChange={(tags) => update({ tags })} />

      {/* SEO */}
      <div className="space-y-5 border-t border-border pt-6">
        <div className="mono-meta text-crimson">SEO</div>
        <div>
          <label htmlFor="meta_title" className="mono-meta mb-2 block text-text-muted">Meta title</label>
          <input
            id="meta_title"
            value={form.meta_title ?? ''}
            onChange={(e) => update({ meta_title: e.target.value || null })}
            placeholder="Defaults to the post title"
            className={inputClass}
          />
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor="meta_description" className="mono-meta text-text-muted">Meta description</label>
            <span className={cn('font-mono text-[10px]', metaDescLen > 160 ? 'text-crimson' : 'text-text-faint')}>
              {metaDescLen}/160
            </span>
          </div>
          <textarea
            id="meta_description"
            rows={3}
            value={form.meta_description ?? ''}
            onChange={(e) => update({ meta_description: e.target.value || null })}
            placeholder="Defaults to the excerpt"
            className={cn(inputClass, 'resize-none')}
          />
        </div>
        <CoverImageField
          label="OG image"
          hint="Social share image. Falls back to the cover image when empty."
          value={form.og_image_url}
          prefix={`og/${postId}`}
          onChange={(url) => update({ og_image_url: url })}
        />
      </div>
    </aside>
  );
}
