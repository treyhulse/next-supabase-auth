"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  tenantId: z.string().min(1, "Tenant is required"),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
  orderItems: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),
});

type OrderFormValues = z.infer<typeof formSchema>;

interface OrderFormProps {
  initialData?: OrderFormValues;
  onSubmit?: (data: OrderFormValues) => void;
  onClose: () => void;
}

export function OrderForm({ initialData, onSubmit, onClose }: OrderFormProps) {
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      customerName: "",
      tenantId: "",
      status: "pending",
      orderItems: [],
    },
  });

  const handleSubmit = async (data: OrderFormValues) => {
    if (onSubmit) {
      await onSubmit(data);
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Order Items</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOrderItems([...orderItems, {}])}
            >
              Add Item
            </Button>
          </div>

          {orderItems.map((_, index) => (
            <div key={index} className="flex gap-4">
              {/* Add product selection and quantity inputs here */}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Order
          </Button>
        </div>
      </form>
    </Form>
  );
} 