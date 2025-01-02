import { createClient } from '@supabase/supabase-js';
import MediaPage from './page-client';
import { FileObject } from '@supabase/storage-js';

// Create a public client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function MediaPageWrapper() {
  const { data: files, error } = await supabase.storage
    .from('products')
    .list();

  if (error) {
    console.error('Error fetching files:', error);
  }

  return <MediaPage initialFiles={files as FileObject[] || []} />;
} 