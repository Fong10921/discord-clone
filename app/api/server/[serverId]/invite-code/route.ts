import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    };

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });;
    }

    const server = await prismadb.server.update({
      where: {
        id: params.serverId,
        userId: user.id,
      },
      data: {
        inviteCode: uuidv4(),
      }
    })

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return new NextResponse("Internal Error", { status: 500});
  }
}
