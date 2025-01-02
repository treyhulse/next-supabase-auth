'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { useDropzone } from 'react-dropzone'

interface MediaFile {
  id: string
  name: string
  url: string
  type: string
  signedUrl: string
  createdAt: string
}

export default function MediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Wrap fetchMedia in useCallback
  const fetchMedia = useCallback(async () => {
    console.log('Fetching media files...')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error('No authenticated user found')
        throw new Error('Not authenticated')
      }

      console.log('User authenticated:', user.id)
      const response = await fetch(`/api/media`)
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText)
        throw new Error('Failed to fetch media')
      }
      const data = await response.json()
      console.log('Fetched media files:', data)
      setMediaFiles(data)
    } catch (err) {
      console.error('Error in fetchMedia:', err)
      setError(err instanceof Error ? err.message : 'Failed to load media')
    } finally {
      setLoading(false)
    }
  }, []) // Empty dependency array since it doesn't depend on any props or state

  // Upload handler with improved error handling and logging
  const handleUpload = useCallback(async (files: File[]) => {
    console.log('Starting upload for files:', files.map(f => f.name))
    const supabase = createClient()
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Auth error:', authError)
        throw new Error('Authentication failed')
      }
      
      if (!user) {
        console.error('No authenticated user found during upload')
        throw new Error('Not authenticated')
      }

      setUploading(true)
      setError(null) // Clear any previous errors
    
      for (const file of files) {
        try {
          console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size}`)
          
          // 1. Upload to Supabase Storage
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`
          const filePath = `${user.id}/${fileName}`

          console.log(`Attempting upload to Supabase storage: ${filePath}`)
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('media')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            console.error('Supabase storage upload error:', uploadError)
            throw new Error(`Upload failed: ${uploadError.message}`)
          }

          console.log('File uploaded successfully to storage:', uploadData?.path)

          // 2. Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath)

          console.log('Generated public URL:', publicUrl)

          // 3. Create database record
          console.log('Creating database record with:', {
            name: fileName,
            url: publicUrl,
            type: file.type
          })

          const response = await fetch('/api/media', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: fileName,
              url: publicUrl,
              type: file.type
            })
          })

          const responseData = await response.json()

          if (!response.ok) {
            console.error('Database record creation failed:', responseData)
            throw new Error(`Database record creation failed: ${responseData.error || 'Unknown error'}`)
          }

          console.log('Database record created successfully:', responseData)

        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError)
          throw fileError // Re-throw to be caught by outer try-catch
        }
      }

      console.log('All files processed successfully, refreshing media list')
      await fetchMedia()
    } catch (err) {
      console.error('Error in handleUpload:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }, [fetchMedia]) // Add fetchMedia to dependencies

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleUpload(acceptedFiles)
  }, [handleUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    }
  })

  useEffect(() => {
    fetchMedia()
  }, [])

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-gray-600">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600">Drag and drop files here, or click to select files</p>
            <p className="text-sm text-gray-500 mt-2">Supported formats: PNG, JPG, GIF, WEBP</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded">
          Error: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && <div>Loading...</div>}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaFiles.map((file) => (
          <div
            key={file.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {file.type.startsWith('image/') ? (
              <div className="relative aspect-square">
                <Image
                  src={file.signedUrl}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-gray-100">
                <span className="text-4xl">📄</span>
              </div>
            )}
            <div className="p-2">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
                {file.id.startsWith('stock-') && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 