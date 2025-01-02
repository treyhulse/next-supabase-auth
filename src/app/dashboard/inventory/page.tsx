import { prisma } from "@/lib/prisma";
import InventoryPage from "./page-client";

export default async function InventoryPageWrapper() {
  const inventory = await prisma.inventory.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          description: true,
          basePrice: true,
          imageUrl: true,
          tenantId: true,
          createdAt: true,
          updatedAt: true,
          tenant: true,
        }
      }
    }
  });

  // Convert Decimal to number for serialization
  const serializedInventory = inventory.map((item: { product: { basePrice: any; }; }) => ({
    ...item,
    product: {
      ...item.product,
      basePrice: Number(item.product.basePrice),
    }
  }));

  return <InventoryPage inventory={serializedInventory} />;
} 