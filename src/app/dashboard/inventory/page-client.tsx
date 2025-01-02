"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";

interface Inventory {
  id: string;
  quantity: number;
  product: {
    name: string;
    tenant: {
      name: string;
    };
  };
}

export default function InventoryPage({ inventory }: { inventory: Inventory[] }) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  const columns = [
    { 
      key: "product", 
      label: "Product",
      render: (item: Inventory) => item.product.name
    },
    { 
      key: "quantity", 
      label: "Quantity" 
    },
    { 
      key: "tenant", 
      label: "Tenant",
      render: (item: Inventory) => item.product.tenant.name
    },
  ];

  const handleUpdateInventory = async () => {
    // Add your update logic here
    toast.success("Inventory updated successfully");
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
      </div>

      <DataTable 
        data={inventory} 
        columns={columns}
        onEdit={(item) => {
          setSelectedItem(item as Inventory);
          setQuantity((item as Inventory).quantity);
          setIsUpdateModalOpen(true);
        }}
      />

      <Modal
        title="Update Inventory"
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              {selectedItem?.product.name}
            </h3>
            <div className="space-y-2">
              <label className="text-sm">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateInventory}>
              Update
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 