"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { ProductForm } from "./_components/product-form";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import { toast } from "react-hot-toast";

// Define TypeScript interfaces
interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  tenantId: string;
  tenant: {
    name: string;
  };
  inventory?: {
    quantity: number;
  };
}

export default function ProductsPage({ products }: { products: Product[] }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { 
      key: "basePrice", 
      label: "Price",
      render: (product: Product) => `$${product.basePrice.toString()}`
    },
    { 
      key: "inventory", 
      label: "Stock",
      render: (product: Product) => product.inventory?.quantity || 0
    },
    { 
      key: "tenant", 
      label: "Tenant",
      render: (product: Product) => product.tenant.name
    },
  ];

  const handleCreate = async (data: any) => {
    try {
      const result = await createProduct(data);
      if (result.success) {
        toast.success("Product created successfully");
        setIsCreateModalOpen(false);
      } else {
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      toast.error("An error occurred while creating the product");
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedProduct) return;
    try {
      const result = await updateProduct(selectedProduct.id, data);
      if (result.success) {
        toast.success("Product updated successfully");
        setIsEditModalOpen(false);
      } else {
        toast.error(result.error || "Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred while updating the product");
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const result = await deleteProduct(selectedProduct.id);
      if (result.success) {
        toast.success("Product deleted successfully");
        setIsDeleteModalOpen(false);
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <DataTable 
        data={products} 
        columns={columns}
        onEdit={(product) => {
          setSelectedProduct(product as Product);
          setIsEditModalOpen(true);
        }}
        onDelete={(product) => {
          setSelectedProduct(product as Product);
          setIsDeleteModalOpen(true);
        }}
      />

      <Modal
        title="Create Product"
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <ProductForm onSubmit={handleCreate} />
      </Modal>

      <Modal
        title="Edit Product"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <ProductForm 
          initialData={selectedProduct} 
          onSubmit={handleEdit} 
        />
      </Modal>

      <Modal
        title="Delete Product"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this product?</p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 