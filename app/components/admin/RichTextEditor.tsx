'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Placeholder, CharacterCount } from '@tiptap/extensions';
import { common, createLowlight } from 'lowlight';
import EditorToolbar from './EditorToolbar';

const lowlight = createLowlight(common);

export default function RichTextEditor({
  postId,
  initialContent,
  onChange,
}: {
  postId: string;
  /** Tiptap JSON doc, or undefined for a blank post. */
  initialContent?: Record<string, unknown>;
  onChange: (json: Record<string, unknown>, html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,          // SSR-safe mount in Next
    shouldRerenderOnTransaction: true, // toolbar active states track the selection
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] }, // h1 is reserved for the post title
        codeBlock: false,               // replaced by the lowlight version below
        link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      TiptapImage,
      Placeholder.configure({ placeholder: 'Write the post…' }),
      CharacterCount,
    ],
    content: initialContent,
    editorProps: {
      // .prose-blog = the exact styling the public post page uses, so the
      // editor is true WYSIWYG.
      attributes: { class: 'prose-blog min-h-[420px] px-6 py-6 focus:outline-none' },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as Record<string, unknown>, editor.getHTML()),
  });

  return (
    <div className="border border-border bg-bg-subtle/30">
      <EditorToolbar editor={editor} postId={postId} />
      <EditorContent editor={editor} />
      {editor && (
        <div className="border-t border-border px-4 py-2 text-right font-mono text-[10px] uppercase tracking-[0.12em] text-text-faint">
          {editor.storage.characterCount.words()} words
        </div>
      )}
    </div>
  );
}
