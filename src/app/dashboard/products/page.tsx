import { prisma } from "@/lib/prisma";
import ProductsPage from "./page-client";
import { Product } from "@/types";

export default async function ProductsPageWrapper() {
  const products = await prisma.product.findMany({
    include: {
      tenant: true,
      inventory: true,
    },
  });

  // Convert any null values to match our Product type
  const serializedProducts = products.map((product: { description: any; imageUrl: any; }) => ({
    ...product,
    description: product.description || null,  // Convert undefined to null
    imageUrl: product.imageUrl || null,
  }));

  return <ProductsPage products={serializedProducts as Product[]} />;
}