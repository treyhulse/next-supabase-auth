const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create Tenants
    const tenant1 = await prisma.tenant.create({
      data: {
        name: "Acme Corporation",
      },
    });

    const tenant2 = await prisma.tenant.create({
      data: {
        name: "Global Industries",
      },
    });

    // Create Users
    const user1 = await prisma.user.create({
      data: {
        id: require('crypto').randomUUID(),
        name: "John Doe",
        email: "john@acme.com",
        tenantId: tenant1.id,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        id: require('crypto').randomUUID(),
        name: "Jane Smith",
        email: "jane@global.com",
        tenantId: tenant2.id,
      },
    });

    // Create Products
    const product1 = await prisma.product.create({
      data: {
        name: "Premium Widget",
        description: "High-quality widget for professional use",
        basePrice: 99.99,
        tenantId: tenant1.id,
      },
    });

    const product2 = await prisma.product.create({
      data: {
        name: "Basic Gadget",
        description: "Affordable gadget for everyday use",
        basePrice: 49.99,
        tenantId: tenant1.id,
      },
    });

    const product3 = await prisma.product.create({
      data: {
        name: "Enterprise Solution",
        description: "Complete business solution package",
        basePrice: 299.99,
        tenantId: tenant2.id,
      },
    });

    // Create Inventory
    await prisma.inventory.create({
      data: {
        productId: product1.id,
        quantity: 100,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product2.id,
        quantity: 150,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product3.id,
        quantity: 50,
      },
    });

    // Create Orders
    const order1 = await prisma.order.create({
      data: {
        userId: user1.id,
        tenantId: tenant1.id,
        status: "completed",
        customerName: "John Doe",
        totalPrice: 199.98,
        orderItems: {
          create: [
            {
              productId: product1.id,
              quantity: 1,
              price: 99.99,
            },
            {
              productId: product2.id,
              quantity: 2,
              price: 49.99,
            },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        userId: user2.id,
        tenantId: tenant2.id,
        status: "pending",
        customerName: "Jane Smith",
        totalPrice: 299.99,
        orderItems: {
          create: [
            {
              productId: product3.id,
              quantity: 1,
              price: 299.99,
            },
          ],
        },
      },
    });

    console.log('Seed data created successfully');

  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 