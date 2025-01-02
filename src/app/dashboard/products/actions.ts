"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductCategory } from "@/types";

interface ProductData {
  name: string;
  description?: string;
  category: ProductCategory;
  basePrice: number;
  imageUrl?: string;
  width?: number | null;
  height?: number | null;
  tenantId: string;
}

export async function createProduct(data: ProductData) {
  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        basePrice: data.basePrice,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: ProductData) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        basePrice: data.basePrice,
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete product" };
  }
} 