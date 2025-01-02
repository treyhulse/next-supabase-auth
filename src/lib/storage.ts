import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ error: any; url: string | null }> {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        upsert: true // Override if exists
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return { error: null, url: data.publicUrl };
  } catch (error) {
    return { error, url: null };
  }
}

export async function deleteProductImage(url: string): Promise<{ error: any }> {
  try {
    // Extract file path from URL
    const path = url.split('/').pop();
    if (!path) throw new Error('Invalid URL');

    const { error } = await supabase.storage
      .from('products')
      .remove([`products/${path}`]);

    return { error };
  } catch (error) {
    return { error };
  }
} 