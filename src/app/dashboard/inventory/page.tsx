import { prisma } from "@/lib/prisma";
import InventoryPage from "./page-client";
import { Inventory } from "@/types";

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

  // Convert Decimal to number for serialization while maintaining all fields
  const serializedInventory = inventory.map((item: { id: any; quantity: any; productId: any; createdAt: any; updatedAt: any; product: { basePrice: any; }; }) => ({
    id: item.id,
    quantity: item.quantity,
    productId: item.productId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    product: {
      ...item.product,
      basePrice: Number(item.product.basePrice),
    }
  }));

  return <InventoryPage inventory={serializedInventory as Inventory[]} />;
} 