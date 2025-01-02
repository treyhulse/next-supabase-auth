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

    // Serialize the products by converting Decimal to number
    const serializedProducts = products.map(product => ({
      ...product,
      basePrice: Number(product.basePrice)
    }))

    return { success: true, data: serializedProducts }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, error: 'Failed to fetch products' }
  }
} 