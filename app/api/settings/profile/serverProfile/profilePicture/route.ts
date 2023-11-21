import getCurrentUser from "@/actions/getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";
import prismadb from "@/lib/prismadb";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, res: NextApiResponse) {
  try {
    if (request.method !== "PATCH") {
      return new NextResponse("Method Incorrect");
    }

    const body = await request.json();
    const { imageUrl, ServerImage } = body;
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const findServerToUpdate = await prismadb.userServerData.findUnique({
      where: {
        serverImage: ServerImage,
      },
    });

    const updatedUserServerData = await prismadb.userServerData.update({
      where: {
        id: findServerToUpdate?.id,
      },
      data: {
        serverProfileImage: imageUrl
      },
    });

    const desensitizeUserServerData = desensitizeDatabaseData(
      "UserServerData",
      [],
      updatedUserServerData
    );

    return NextResponse.json(desensitizeUserServerData);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

