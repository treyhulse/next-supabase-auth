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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { createUser, updateUser } from "../actions";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  tenantId: z.string().min(1, "Tenant is required"),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData?: {
    id: string;
    name?: string | undefined;
    email: string;
    tenantId: string;
  };
  tenants: Array<{ id: string; name: string }>;
  onClose: () => void;
}

export function UserForm({ initialData, tenants, onClose }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      tenantId: initialData?.tenantId ?? "",
    },
  });

  const handleSubmit = async (data: UserFormValues) => {
    try {
      if (initialData) {
        const result = await updateUser(initialData.id, data);
        if (result.success) {
          toast.success("User updated");
        } else {
          toast.error(result.error ?? "Failed to update user");
        }
      } else {
        const result = await createUser(data);
        if (result.success) {
          toast.success("User created");
        } else {
          toast.error(result.error ?? "Failed to create user");
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
                <Input {...field} placeholder="Enter user name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter email address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tenantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenant</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Create"} User
          </Button>
        </div>
      </form>
    </Form>
  );
} 