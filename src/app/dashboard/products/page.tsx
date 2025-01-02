import { prisma } from "@/lib/prisma";
import ProductsPage from "./page-client";

export default async function ProductsPageWrapper() {
  const products = await prisma.product.findMany({
    include: {
      tenant: true,
      inventory: true,
    },
  });

  return <ProductsPage products={products} />;
}