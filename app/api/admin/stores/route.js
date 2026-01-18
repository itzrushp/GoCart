
import { prisma } from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin"
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// get all approved stores
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 })
        }

        const stores = await prisma.store.findMany({
            where: { status: { in: ["approved"] } },
            include: { user: true }
        })

        return NextResponse.json({ stores })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}
// Add this to your existing api/admin/stores file
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const { storeId } = await request.json();

        // 1. Get the current store status
        const store = await prisma.store.findUnique({
            where: { id: storeId }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        // 2. Toggle the isActive status
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: { isActive: !store.isActive }
        });

        return NextResponse.json({ 
            message: `Store is now ${updatedStore.isActive ? 'Active' : 'Inactive'}` 
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}