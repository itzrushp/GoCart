
// // Auth Seller

// import { prisma } from "@/lib/prisma";
// import authSeller from "@/middlewares/authSeller"
// import { NextResponse } from "next/server";
// import { getAuth } from "@clerk/nextjs/server";

// export async function GET(request) {
//     try {
//         const { userId } = getAuth(request);
//         const isSeller = await authSeller(userId);

//         if (!isSeller) {
//             return NextResponse.json(
//                 { error: "not authorized" },
//                 { status: 401 }
//             );
//         }

//         const storeInfo = await prisma.store.findUnique({
//             where: { userId },
//         });

//         return NextResponse.json({ isSeller, storeInfo });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             { error: error.code || error.message },
//             { status: 400 }
//         );
//     }

// }

import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server"; // Added missing import
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        
        // Ensure userId exists before calling middleware
        if (!userId) {
            return NextResponse.json({ isSeller: false }, { status: 401 });
        }

        const isSeller = await authSeller(userId);

        // If not a seller, return isSeller: false instead of a 401 error
        // This allows your frontend 'data.isSeller' check to work smoothly
        if (!isSeller) {
            return NextResponse.json({ isSeller: false, storeInfo: null });
        }

        const storeInfo = await prisma.store.findUnique({
            where: { userId },
        });

        // Ensure storeInfo exists and is approved
        if (!storeInfo || storeInfo.status !== 'approved') {
             return NextResponse.json({ isSeller: false, storeInfo: null });
        }

        return NextResponse.json({ isSeller: true, storeInfo });
        
    } catch (error) {
        console.error("is-seller API Error:", error);
        return NextResponse.json(
            { isSeller: false, error: error.message },
            { status: 200 } // Returning 200 so the frontend can handle the 'false' state
        );
    }
}