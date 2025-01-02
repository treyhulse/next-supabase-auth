'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
} 