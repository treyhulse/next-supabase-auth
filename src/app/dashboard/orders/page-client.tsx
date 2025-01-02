"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { OrderForm } from "./_components/order-form";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Order {
  id: string;
  customerName: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  totalPrice: number;
  tenant: { name: string };
  user?: { email: string };
  orderItems: Array<{
    product: { name: string };
    quantity: number;
    price: number;
  }>;
  createdAt: Date;
}

export default function OrdersPage({ orders }: { orders: Order[] }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const columns = [
    { 
      key: "customerName", 
      label: "Customer" 
    },
    { 
      key: "status", 
      label: "Status",
      render: (order: Order) => (
        <span className={`capitalize ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      )
    },
    { 
      key: "totalPrice", 
      label: "Total",
      render: (order: Order) => `$${order.totalPrice}`
    },
    { 
      key: "createdAt", 
      label: "Date",
      render: (order: Order) => format(new Date(order.createdAt), 'PP')
    },
    { 
      key: "tenant", 
      label: "Tenant",
      render: (order: Order) => order.tenant.name
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600";
      case "processing": return "text-blue-600";
      case "completed": return "text-green-600";
      case "cancelled": return "text-red-600";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <DataTable 
        data={orders} 
        columns={columns}
        onEdit={(order) => {
          setSelectedOrder(order as Order);
          setIsViewModalOpen(true);
        }}
      />

      <Modal
        title="Create Order"
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <OrderForm onClose={() => setIsCreateModalOpen(false)} />
      </Modal>

      <Modal
        title="Order Details"
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Customer</h3>
                <p>{selectedOrder.customerName}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <p className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.orderItems.map((item) => (
                  <div key={item.product.name} className="flex justify-between">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${selectedOrder.totalPrice}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 