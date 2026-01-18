// import { clerkClient } from "@clerk/nextjs/server";

// const authAdmin = async (userId) => {
//   try {
//     if (!userId) return false;

//     const client = clerkClient();
//     const user = await client.users.getUser(userId);

//     const adminEmails =
//       process.env.ADMIN_EMAIL?.split(",").map(e => e.trim()) || [];

//     const userEmail = user.emailAddresses.find(
//       (e) => e.id === user.primaryEmailAddressId
//     )?.emailAddress;

//     if (!userEmail) return false;

//     return adminEmails.includes(userEmail);
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// };

// export default authAdmin;
// import authAdmin from "@/middlewares/authAdmin";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { error: "unauthenticated" },
        { status: 401 }
      );
    }

    const isAdmin = await authAdmin(userId);

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

