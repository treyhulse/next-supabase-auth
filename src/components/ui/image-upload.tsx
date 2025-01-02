"use client";

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { uploadProductImage } from '@/lib/storage';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  productId: string;
}

export function ImageUpload({ value, onChange, productId }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = e.target.files?.[0];
      
      if (!file) return;

      if (!file.type.includes('image')) {
        toast.error('Please upload an image file');
        return;
      }

      const { error, url } = await uploadProductImage(file, productId);

      if (error || !url) {
        throw error || new Error('Failed to upload image');
      }

      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [onChange, productId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="secondary"
          disabled={isLoading}
          onClick={() => document.getElementById('imageUpload')?.click()}
        >
          {isLoading ? 'Uploading...' : 'Upload Image'}
        </Button>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>
      {value && (
        <div className="relative aspect-square w-40">
          <Image
            src={value}
            alt="Product image"
            className="object-cover rounded-md"
            fill
          />
        </div>
      )}
    </div>
  );
} 