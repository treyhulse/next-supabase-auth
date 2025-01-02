"use client";

import { useState, useCallback } from 'react';
import { StorageError, FileObject } from '@supabase/storage-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { Loader2, Trash, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Create a public client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false // This ensures we don't try to persist the session
    }
  }
);

interface MediaPageProps {
  initialFiles: FileObject[];
}

export default function MediaPage({ initialFiles }: MediaPageProps) {
  const [files, setFiles] = useState<FileObject[]>(initialFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const refreshFiles = async () => {
    const { data, error } = await supabase.storage
      .from('media')
      .list();
    
    if (error) {
      console.error('Error refreshing files:', error);
      toast.error('Failed to refresh files');
      return;
    }
    
    if (data) setFiles(data);
  };

  const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const file = e.target.files?.[0];
      
      if (!file) return;

      if (!file.type.includes('image')) {
        toast.error('Please upload an image file');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      toast.success('File uploaded successfully');
      refreshFiles();
    } catch (error) {
      toast.error('Failed to upload file');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDelete = async (file: FileObject) => {
    try {
      const { error } = await supabase.storage
        .from('products')
        .remove([file.name]);

      if (error) throw error;

      toast.success('File deleted successfully');
      refreshFiles();
    } catch (error) {
      toast.error('Failed to delete file');
      console.error(error);
    }
  };

  const getFileUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => document.getElementById('fileUpload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </>
            )}
          </Button>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {files.map((file) => (
          <div
            key={file.id}
            className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
          >
            <Image
              src={getFileUrl(file.name)}
              alt={file.name}
              className="object-cover cursor-pointer transition-transform group-hover:scale-105"
              fill
              onClick={() => {
                setSelectedFile(file);
                setIsPreviewOpen(true);
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(file)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="relative aspect-video">
              <Image
                src={getFileUrl(selectedFile.name)}
                alt={selectedFile.name}
                className="object-contain"
                fill
              />
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Size: {Math.round(selectedFile?.metadata?.size / 1024)} KB
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedFile) handleDelete(selectedFile);
                setIsPreviewOpen(false);
              }}
            >
              Delete File
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
} 