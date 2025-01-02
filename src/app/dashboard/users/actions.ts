"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createUser(data: {
  name?: string;
  email: string;
  tenantId: string;
}) {
  try {
    const user = await prisma.user.create({
      data: {
        ...data,
        id: crypto.randomUUID(), // Generate UUID for user ID
      }
    });

    revalidatePath("/dashboard/users");
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Failed to create user" };
  }
}

export async function updateUser(id: string, data: {
  name?: string;
  email: string;
  tenantId: string;
}) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data
    });

    revalidatePath("/dashboard/users");
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    });

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete user" };
  }
} 