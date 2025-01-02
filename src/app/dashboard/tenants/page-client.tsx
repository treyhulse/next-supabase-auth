"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { TenantForm } from "./_components/tenant-form";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Tenant {
  id: string;
  name: string;
  createdAt: Date;
  _count: {
    products: number;
    users: number;
    orders: number;
  };
}

export default function TenantsPage({ tenants }: { tenants: Tenant[] }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const columns = [
    { key: "name", label: "Name" },
    { 
      key: "products", 
      label: "Products",
      render: (tenant: Tenant) => tenant._count.products
    },
    { 
      key: "users", 
      label: "Users",
      render: (tenant: Tenant) => tenant._count.users
    },
    { 
      key: "orders", 
      label: "Orders",
      render: (tenant: Tenant) => tenant._count.orders
    },
    { 
      key: "createdAt", 
      label: "Created",
      render: (tenant: Tenant) => format(new Date(tenant.createdAt), 'PP')
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      <DataTable 
        data={tenants} 
        columns={columns}
        onEdit={(tenant) => {
          setSelectedTenant(tenant as Tenant);
          setIsEditModalOpen(true);
        }}
      />

      <Modal
        title="Create Tenant"
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <TenantForm onClose={() => setIsCreateModalOpen(false)} />
      </Modal>

      <Modal
        title="Edit Tenant"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <TenantForm 
          initialData={selectedTenant ? {
            id: selectedTenant.id,
            name: selectedTenant.name
          } : undefined} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      </Modal>
    </div>
  );
} 