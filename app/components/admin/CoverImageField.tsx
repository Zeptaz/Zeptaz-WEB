'use client';
import { useRef, useState } from 'react';
import { ImagePlus, LoaderCircle, X } from 'lucide-react';
import { uploadBlogImage } from '@/lib/upload';

/** Image upload field used for the cover image and the OG image. */
export default function CoverImageField({
  label,
  hint,
  value,
  prefix,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string | null;
  /** Storage path prefix, e.g. `covers/{postId}`. */
  prefix: string;
  onChange: (url: string | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onFile = async (file: File) => {
    setUploading(true);
    try {
      onChange(await uploadBlogImage(file, prefix));
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="mono-meta mb-2 text-text-muted">{label}</div>
      {value ? (
        <div className="relative border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="aspect-[16/9] w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-bg-primary/80 text-text-secondary backdrop-blur-sm transition-colors hover:text-crimson"
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 border border-dashed border-border-strong text-text-muted transition-colors hover:border-crimson hover:text-crimson disabled:cursor-wait"
        >
          {uploading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{uploading ? 'Uploading…' : 'Upload image'}</span>
        </button>
      )}
      {hint && <p className="mt-2 font-mono text-[10px] leading-relaxed text-text-faint">{hint}</p>}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onFile(file);
        }}
      />
    </div>
  );
}
