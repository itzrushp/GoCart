import imagekit from "@/configd/imageKit";
import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "not authorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const images = formData.getAll("images");

    if (
      !name ||
      !description ||
      mrp <= 0 ||
      price <= 0 ||
      !category ||
      images.length < 1
    ) {
      return NextResponse.json(
        { error: "missing product details" },
        { status: 400 }
      );
    }

    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products",
        });

        return imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1024" },
          ],
        });
      })
    );


    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category,
        images: imagesUrl,
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    });

    return NextResponse.json({ message: "Product Added Successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const store = await authSeller(userId);

    if (!store) {
      return NextResponse.json(
        { error: "not authorized" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

