"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { createClient } from '@/utils/supabase/client'
import { useAuth } from "@/lib/auth"
import { toast } from "react-hot-toast"
import type { MediaFile } from "@/types"

interface MediaSelectorProps {
  onSelectMedia: (media: MediaFile) => void
}

export function MediaSelector({ onSelectMedia }: MediaSelectorProps) {
  const { user } = useAuth()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchUserMedia = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const response = await fetch(`/api/media?userId=${user.id}`)
      if (!response.ok) throw new Error('Failed to fetch media')
      const data = await response.json()
      setMediaFiles(data)
    } catch (error) {
      toast.error('Failed to load media files')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user) {
      fetchUserMedia()
    }
  }, [user, fetchUserMedia])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length || !user) return

    setIsUploading(true)
    try {
      const file = files[0]
      
      if (!file.type.includes('image')) {
        toast.error('Please upload an image file')
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      // Save to database
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          url: publicUrl,
          type: file.type
        })
      })

      if (!response.ok) throw new Error('Failed to save media file')
      
      const newMedia = await response.json()
      setMediaFiles(prev => [...prev, newMedia])
      onSelectMedia(newMedia)
      toast.success('File uploaded successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Media Files</h3>
        {user ? (
          <Button size="sm" disabled={isUploading}>
            <label className="cursor-pointer flex items-center gap-2">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
        ) : (
          <Button size="sm" disabled>Sign in to upload</Button>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 gap-2">
          {mediaFiles.map((file) => (
            <div
              key={file.id}
              className="cursor-pointer group relative aspect-square"
              onClick={() => onSelectMedia(file)}
            >
              <Image
                src={file.url}
                alt={file.name}
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
} 