import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@/utils/supabase/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  console.log('GET /api/media - Starting request')
  const supabase = createClient()
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Authentication error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!user) {
      console.error('No user found in session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Authenticated user:', user.id)

    // Get files from both user folder and stock folder
    console.log('Fetching files from user folder and stock folder')
    const [
      mediaFiles, 
      { data: userBucketFiles, error: userBucketError },
      { data: stockBucketFiles, error: stockBucketError }
    ] = await Promise.all([
      prisma.mediaFile.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      }),
      supabase.storage.from('media').list(user.id + '/'),
      supabase.storage.from('media').list('stock/')
    ])

    if (userBucketError) {
      console.error('User bucket error:', userBucketError)
    }

    if (stockBucketError) {
      console.error('Stock bucket error:', stockBucketError)
    }

    console.log('Found database records:', mediaFiles.length)
    console.log('Found user bucket files:', userBucketFiles?.length || 0)
    console.log('Found stock bucket files:', stockBucketFiles?.length || 0)

    // Get stock files
    const stockFiles = (stockBucketFiles || []).map(file => ({
      id: `stock-${file.name}`,
      name: file.name,
      url: supabase.storage.from('media').getPublicUrl(`stock/${file.name}`).data.publicUrl,
      type: file.metadata?.mimetype || 'image/jpeg', // Default to jpeg if mimetype is not available
      signedUrl: supabase.storage.from('media').getPublicUrl(`stock/${file.name}`).data.publicUrl,
      createdAt: file.created_at || new Date().toISOString()
    }))

    // Combine user files with URLs
    const userFiles = mediaFiles.map(file => ({
      ...file,
      signedUrl: supabase.storage.from('media').getPublicUrl(`${user.id}/${file.name}`).data.publicUrl
    }))

    // Combine both sets of files
    const allFiles = [...userFiles, ...stockFiles]

    console.log('Total files to return:', allFiles.length)
    console.log('Stock files:', stockFiles.length)
    console.log('User files:', userFiles.length)

    return NextResponse.json(allFiles)
  } catch (error) {
    console.error('Failed to fetch media files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  console.log('POST /api/media - Starting request')
  const supabase = createClient()
  
  try {
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Authentication error:', authError)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
    
    if (!user) {
      console.error('No user found in session')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // 2. Validate request body
    const body = await request.json()
    console.log('Received body:', body)
    
    const { name, url, type } = body

    if (!name || !url || !type) {
      console.error('Missing required fields:', { name, url, type })
      return NextResponse.json(
        { error: 'Missing required fields: name, url, and type are required' },
        { status: 400 }
      )
    }

    // 3. Create database record
    console.log('Creating database record for:', {
      name,
      url,
      type,
      userId: user.id
    })

    const mediaFile = await prisma.mediaFile.create({
      data: {
        name,
        url,
        type,
        userId: user.id
      }
    })

    console.log('Successfully created database record:', mediaFile)
    return NextResponse.json(mediaFile)

  } catch (error) {
    console.error('Failed to create media file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create media file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 