import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PostEditorShell from '@/components/admin/PostEditorShell';
import type { Post } from '@/lib/types';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  return <PostEditorShell post={data as Post} />;
}
