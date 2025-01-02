"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTenant(data: {
  name: string;
}) {
  try {
    const tenant = await prisma.tenant.create({
      data
    });

    revalidatePath("/dashboard/tenants");
    return { success: true, data: tenant };
  } catch (error) {
    return { success: false, error: "Failed to create tenant" };
  }
}

export async function updateTenant(id: string, data: {
  name: string;
}) {
  try {
    const tenant = await prisma.tenant.update({
      where: { id },
      data
    });

    revalidatePath("/dashboard/tenants");
    return { success: true, data: tenant };
  } catch (error) {
    return { success: false, error: "Failed to update tenant" };
  }
}

export async function deleteTenant(id: string) {
  try {
    await prisma.tenant.delete({
      where: { id }
    });

    revalidatePath("/dashboard/tenants");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete tenant" };
  }
} 