import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { name, imageUrl } = await req.json();
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const server = await prismadb.server.update({
      where: {
        id: params.serverId,
        userId: user.id
      },
      data: {
        name: name,
        imageUrl: imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { serverId: string }}) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    };

    if (!params.serverId) {
      return new NextResponse("ServerId Missing", { status: 400 })
    }

    const server = await prismadb.server.delete({
      where: {
        id: params.serverId,
        userId: user.id,
      },
    })

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
