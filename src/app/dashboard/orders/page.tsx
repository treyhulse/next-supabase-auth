import { prisma } from "@/lib/prisma";
import OrdersPage from "./page-client";

export default async function OrdersPageWrapper() {
  const orders = await prisma.order.findMany({
    include: {
      tenant: true,
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return <OrdersPage orders={orders} />;
} 