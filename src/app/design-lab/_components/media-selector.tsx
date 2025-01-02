"use client"

import { useEffect, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Image as ImageIcon, Loader2, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { createClient } from '@/utils/supabase/client'
import { useAuth } from "@/lib/auth"
import { toast } from "react-hot-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { uploadMedia, fetchUserMedia, fetchStockMedia, deleteMedia } from './actions'

// Update the MediaFile type or create a StorageFile type
type StorageFile = {
  id: string
  name: string
  url: string
  type: string
  userId: string
}

interface MediaSelectorProps {
  onSelectMedia: (media: StorageFile) => void
}

export function MediaSelector({ onSelectMedia }: MediaSelectorProps) {
  const { user } = useAuth()
  const [userFiles, setUserFiles] = useState<StorageFile[]>([])
  const [stockImages, setStockImages] = useState<StorageFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const supabase = createClient()

  const fetchMedia = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Fetch stock images
      const stockResult = await fetchStockMedia()
      if (!stockResult.success) {
        console.error('Stock fetch error:', stockResult.error)
        toast.error('Failed to load stock images')
      } else {
        setStockImages(stockResult.files || [])
      }

      // Fetch user images if authenticated
      if (user?.id) {
        const userResult = await fetchUserMedia(user.id)
        if (!userResult.success) {
          console.error('User media fetch error:', userResult.error)
          toast.error('Failed to load your images')
        } else {
          setUserFiles(userResult.files || [])
        }
      }
    } catch (error) {
      console.error('Media fetch error:', error)
      toast.error('Failed to load media files')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length || !user?.id) {
      toast.error('Please sign in to upload files')
      return
    }

    setIsUploading(true)
    try {
      const file = files[0]
      const result = await uploadMedia(file, user.id)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success('File uploaded successfully')
      await fetchMedia() // Refresh the media list
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (file: StorageFile) => {
    if (!user?.id) {
      toast.error('Please sign in to delete files')
      return
    }

    try {
      const result = await deleteMedia(file.name, user.id)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      setUserFiles(prev => prev.filter(f => f.id !== file.id))
      toast.success('File deleted successfully')
      setShowDeleteAlert(false)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete file')
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
      <Tabs defaultValue="uploads" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
            <TabsTrigger value="stock">Stock Images</TabsTrigger>
          </TabsList>

          {user && (
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
          )}
        </div>

        <TabsContent value="uploads" className="mt-0">
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 gap-2">
              {userFiles.map((file) => (
                <div
                  key={file.id}
                  className="group relative aspect-square"
                >
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onSelectMedia(file)}
                      >
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedFile(file)
                          setShowDeleteAlert(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="stock" className="mt-0">
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 gap-2">
              {stockImages.map((file) => (
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
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedFile && handleDelete(selectedFile)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
} 