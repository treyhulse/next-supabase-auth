import { prisma } from "@/lib/prisma";
import InventoryPage from "./page-client";

export default async function InventoryPageWrapper() {
  const inventory = await prisma.inventory.findMany({
    include: {
      product: {
        include: {
          tenant: true,
        },
      },
    },
  });

  return <InventoryPage inventory={inventory} />;
} 