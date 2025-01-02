import { prisma } from "@/lib/prisma";
import OrdersPage from "./page-client";
import { Order } from "@/types";

export default async function OrdersPageWrapper() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      tenant: true,
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  // Convert Decimal to number for serialization
  const serializedOrders = orders.map((order: { totalPrice: any; orderItems: any[]; }) => ({
    ...order,
    totalPrice: Number(order.totalPrice),
    orderItems: order.orderItems.map(item => ({
      ...item,
      price: Number(item.price)
    }))
  }));

  return <OrdersPage orders={serializedOrders as Order[]} />;
} 