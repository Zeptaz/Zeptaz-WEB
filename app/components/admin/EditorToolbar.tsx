'use client';
import { useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Heading2, Heading3, Heading4, Bold, Italic, Strikethrough,
  List, ListOrdered, Quote, Code, SquareCode, Link2, ImagePlus,
  Undo2, Redo2, LoaderCircle, Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadBlogImage } from '@/lib/upload';

function ToolButton({
  onClick, active = false, disabled = false, label, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; label: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep editor selection/focus
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center transition-colors',
        active ? 'bg-crimson/15 text-crimson' : 'text-text-muted hover:text-text-primary',
        disabled && 'opacity-40 hover:text-text-muted',
      )}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-5 w-px bg-border" aria-hidden />;

export default function EditorToolbar({ editor, postId }: { editor: Editor | null; postId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', prev ?? 'https://');
    if (url === null) return;
    const chain = editor.chain().focus().extendMarkRange('link');
    if (url === '') chain.unsetLink().run();
    else chain.setLink({ href: url }).run();
  };

  const insertImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadBlogImage(file, `inline/${postId}`);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      alert(`Image upload failed: ${err instanceof Error ? err.message : 'unknown error'}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const icon = 'h-4 w-4';

  return (
    <div className="sticky top-14 z-30 flex flex-wrap items-center gap-0.5 border-b border-border bg-bg-subtle px-2 py-1.5">
      <ToolButton label="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className={icon} /></ToolButton>
      <ToolButton label="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className={icon} /></ToolButton>
      <ToolButton label="Heading 4" active={editor.isActive('heading', { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 className={icon} /></ToolButton>
      <Divider />
      <ToolButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className={icon} /></ToolButton>
      <ToolButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className={icon} /></ToolButton>
      <ToolButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className={icon} /></ToolButton>
      <Divider />
      <ToolButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className={icon} /></ToolButton>
      <ToolButton label="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className={icon} /></ToolButton>
      <ToolButton label="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className={icon} /></ToolButton>
      <ToolButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className={icon} /></ToolButton>
      <Divider />
      <ToolButton label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><Code className={icon} /></ToolButton>
      <ToolButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><SquareCode className={icon} /></ToolButton>
      <Divider />
      <ToolButton label="Link" active={editor.isActive('link')} onClick={setLink}><Link2 className={icon} /></ToolButton>
      <ToolButton label="Insert image" disabled={uploading} onClick={() => fileRef.current?.click()}>
        {uploading ? <LoaderCircle className={cn(icon, 'animate-spin')} /> : <ImagePlus className={icon} />}
      </ToolButton>
      <Divider />
      <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className={icon} /></ToolButton>
      <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className={icon} /></ToolButton>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void insertImage(file);
        }}
      />
    </div>
  );
}
