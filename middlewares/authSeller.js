

import {prisma} from "@/lib/prisma";

// const authSeller = async (userId) => {
//   try {
//     if (!userId) return false;

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: { store: true },
//     });

//     if (!user || !user.store) return false;

//     if (user.store.status !== "approved") return false;

//     return user.store; // return full store info (best)
//   } catch (error) {
//     console.error("authSeller error:", error);
//     return false;
//   }
// };

// export default authSeller;
const authSeller = async (userId) => {
  try {
    if (!userId) return false;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { store: true },
    });

    if (!user || !user.store) return false;

    if (user.store.status !== "approved") return false;

    return user.store.id; // ✅ THIS is what you want
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default authSeller;

