import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from '@/utils/supabase/server'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const supabase = createClient()
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // Verify the authenticated user matches the requested userId
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const mediaFiles = await prisma.mediaFile.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(mediaFiles)
  } catch (error) {
    console.error('Failed to fetch media files:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = createClient()
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, url, type } = body

    const mediaFile = await prisma.mediaFile.create({
      data: {
        name,
        url,
        type,
        userId: user.id
      }
    })

    return NextResponse.json(mediaFile)
  } catch (error) {
    console.error('Failed to create media file:', error)
    return NextResponse.json(
      { error: 'Failed to create media file' },
      { status: 500 }
    )
  }
} 