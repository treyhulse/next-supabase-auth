"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { UserForm } from "./_components/user-form";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface User {
  id: string;
  name: string | null;
  email: string;
  tenant: {
    id: string;
    name: string;
  };
  _count: {
    orders: number;
  };
  createdAt: Date;
}

interface Tenant {
  id: string;
  name: string;
}

interface UsersPageProps {
  users: User[];
  tenants: Tenant[];
}

export default function UsersPage({ users, tenants }: UsersPageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns = [
    { 
      key: "name", 
      label: "Name",
      render: (user: User) => user.name || "N/A"
    },
    { key: "email", label: "Email" },
    { 
      key: "tenant", 
      label: "Tenant",
      render: (user: User) => user.tenant.name
    },
    { 
      key: "orders", 
      label: "Orders",
      render: (user: User) => user._count.orders
    },
    { 
      key: "createdAt", 
      label: "Joined",
      render: (user: User) => format(new Date(user.createdAt), 'PP')
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <DataTable 
        data={users} 
        columns={columns}
        onEdit={(user) => {
          setSelectedUser(user as User);
          setIsEditModalOpen(true);
        }}
      />

      <Modal
        title="Create User"
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <UserForm 
          tenants={tenants}
          onClose={() => setIsCreateModalOpen(false)} 
        />
      </Modal>

      <Modal
        title="Edit User"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <UserForm 
          initialData={selectedUser ? {
            id: selectedUser.id,
            name: selectedUser.name ?? undefined,
            email: selectedUser.email,
            tenantId: selectedUser.tenant.id
          } : undefined}
          tenants={tenants}
          onClose={() => setIsEditModalOpen(false)} 
        />
      </Modal>
    </div>
  );
} 