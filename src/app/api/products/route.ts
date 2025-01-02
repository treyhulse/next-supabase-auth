import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // First check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { data: products, error } = await supabase
      .from('Product')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 