import { prisma } from "@/lib/prisma";
import UsersPage from "./page-client";

export default async function UsersPageWrapper() {
  const [users, tenants] = await Promise.all([
    prisma.user.findMany({
      include: {
        tenant: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    }),
    prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return <UsersPage users={users} tenants={tenants} />;
} 