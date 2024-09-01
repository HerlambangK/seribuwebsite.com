import { prisma } from "@/server/db";
import { defineEventHandler, H3Event, readBody } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const userId = event.context.user.id;

  // Baca data dari request body
  const body = await readBody(event);
  const { packageId, customOrderData } = body;

  // Validasi input
  if (!packageId) {
    return {
      statusCode: 400,
      statusMessage: "Package ID is required",
    };
  }

  if (![1, 2, 3].includes(packageId)) {
    return {
      statusCode: 400,
      statusMessage: "Invalid package ID",
    };
  }

  if (packageId === 3 && !customOrderData) {
    return {
      statusCode: 400,
      statusMessage: "Custom order data is required for package ID 3",
    };
  }

  // Debug log untuk memeriksa nilai
  console.log("Creating order with:", { userId, packageId, customOrderData });

  // Membuat pesanan baru
  const newOrder = await prisma.order.create({
    data: {
      userId,
      packageId,
      status: "Pending",
      totalPrice: packageId !== 3 ? await calculatePackagePrice(packageId) : 0,
      customOrder: customOrderData
        ? {
            create: {
              websiteType: customOrderData.websiteType || "",
              details: customOrderData.details || "",
              pageCount: customOrderData.pageCount || 0,
              requirements: customOrderData.requirements || "",
              status: "Pending",
            },
          }
        : undefined,
    },
    include: {
      package: true,
      customOrder: true,
    },
  });

  return newOrder;
});

// Fungsi untuk menghitung harga paket
async function calculatePackagePrice(packageId: number) {
  const selectedPackage = await prisma.package.findUnique({
    where: { id: packageId },
  });

  if (!selectedPackage) {
    return {
      statusCode: 404,
      statusMessage: "Package not found",
    };
  }

  return selectedPackage.price;
}
