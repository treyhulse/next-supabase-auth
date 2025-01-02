import { prisma } from "@/lib/prisma";
import ProductsPage from "./page-client";
import { Product } from "@/types";

export default async function ProductsPageWrapper() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      basePrice: true,
      imageUrl: true,
      tenantId: true,
      createdAt: true,
      updatedAt: true,
      tenant: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      inventory: true,
    }
  });

  // Convert Decimal to number for serialization
  const serializedProducts = products.map((product: { basePrice: any; }) => ({
    ...product,
    basePrice: Number(product.basePrice),
  }));

  return <ProductsPage products={serializedProducts as Product[]} />;
}