import { prisma } from "@/lib/prisma";
import TenantsPage from "./page-client";

export default async function TenantsPageWrapper() {
  const tenants = await prisma.tenant.findMany({
    include: {
      _count: {
        select: {
          products: true,
          users: true,
          orders: true,
        },
      },
    },
  });

  return <TenantsPage tenants={tenants} />;
} 