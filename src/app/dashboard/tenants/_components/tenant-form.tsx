"use client";

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
import { toast } from "react-hot-toast";
import { createTenant, updateTenant } from "../actions";

const formSchema = z.object({
  name: z.string().min(1, "Tenant name is required"),
});

type TenantFormValues = z.infer<typeof formSchema>;

interface TenantFormProps {
  initialData?: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

export function TenantForm({ initialData, onClose }: TenantFormProps) {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  const handleSubmit = async (data: TenantFormValues) => {
    try {
      if (initialData) {
        const result = await updateTenant(initialData.id, data);
        if (result.success) {
          toast.success("Tenant updated");
        } else {
          toast.error(result.error ?? "Failed to update tenant");
        }
      } else {
        const result = await createTenant(data);
        if (result.success) {
          toast.success("Tenant created");
        } else {
          toast.error(result.error ?? "Failed to create tenant");
        }
      }
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter tenant name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Create"} Tenant
          </Button>
        </div>
      </form>
    </Form>
  );
} 