

// Get Store info and Store Products

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        //Get store username from query param 
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username ').toLowerCase();

        if (!username) {
            return NextResponse.json({ error: "missing username" }, { status: 400 })
        }
        // get store info and instock prodcuts with ratings 
        const store = await prisma.store.findUnique({
            where: { username, isActive: true },
            include: { Product: { inlcude: { rating: true } } }
        })
        if (!store) {
            return NextResponse.json({ error: "store not found" }, { status: 400 })
        }

        return NextResponse.json({ store })
    }
    catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.code || error.message },
            { status: 400 }
        );

    }

}