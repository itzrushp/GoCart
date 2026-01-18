import authSeller from "@/middlewares/authSeller"


// update seller order status 
export async function POST(request){
  try {
    const { userId } = getAuth(request)
    const storeId = await authSeller(userId)

    if(!storeId){
      return NextResponse.json({ error: 'not authorized' }, { status: 401 })
    }

    const {orderId, status } = await request.json()

    await prisma.order.update({
      where: { id: orderId, storeId },
      data: {status}
    })

    return NextResponse.json({message: "Order Status updated"})
  } catch (error) {
    console.error(error);
    return NextResponse.json({message:"Order Status updated"})
  }
}

// Get all orders for a seller 

export async function GET(request){
    try{
        const {userId} = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: 'not authorized'}, {status:401})
        }
        const orders = await prisma.order.findMany({
            where : {storeId},
            inlcude:{iser:true, address:true, orderItems: {include: {product: tru}}},
            orderBy:{createdAt : 'desc'} 
        })
        return NextResponse.json({orders})
    }catch(error){
        console.error(error);
        return NextResponse.json({message:"Order Status updated"})
    }
}