import { Prisma } from '@prisma/client';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  tenantId: string;
  userId: string | null;
  customerName: string;
  status: OrderStatus;
  totalPrice: number;
  tenant: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  orderItems: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  inventory: {
    id: string;
    quantity: number;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  id: string;
  quantity: number;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    description: string | null;
    basePrice: number;
    imageUrl: string | null;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
    tenant: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
} 