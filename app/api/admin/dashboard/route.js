
// Get DashBoard Data for Admin (total orders , total stores, total products ,total revenue)
import { prisma } from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "not authorized" },
        { status: 401 }
      );
    }

    // total orders
    const orders = await prisma.order.count();

    // total stores
    const stores = await prisma.store.count();

    // total products
    const products = await prisma.product.count();

    // revenue
    const allOrders = await prisma.order.findMany({
      select: {
        createdAt: true,
        total: true,
      },
    });

    const totalRevenue = allOrders.reduce(
      (acc, order) => acc + order.total,
      0
    );

    const revenue = Number(totalRevenue.toFixed(2));

    return NextResponse.json({
      dashboardData: {
        orders,
        stores,
        products,
        revenue,
        allOrders,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
