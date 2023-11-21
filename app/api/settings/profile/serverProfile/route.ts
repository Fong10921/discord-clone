import getCurrentUser from "@/actions/getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";
import prismadb from "@/lib/prismadb";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(request: Request, res: NextApiResponse) {
  try {
    if (request.method !== "POST") {
      return new NextResponse("Method Incorrect");
    }

    const body = await request.json();
    const {
      serverProfileNickname,
      serverProfilePronouns,
      serverProfileAboutMe,
      currentServerImageUseAsId,
    } = body;
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const findServerIdUsingServerImage = await prismadb.server.findFirst({
      where: {
        imageUrl: currentServerImageUseAsId,
      },
    });

    const updatedServerProfileData = await prismadb.userServerData.create({
      data: {
        serverProfileNickname,
        serverProfilePronouns,
        serverProfileAboutMe,
        userId: user?.id,
        serverId: findServerIdUsingServerImage?.id!,
        serverImage: findServerIdUsingServerImage?.imageUrl!,
      },
    });

    const desensitizedUserServerData = desensitizeDatabaseData(
      "UserServerData",
      ["BannerColor"],
      updatedServerProfileData
    );

    return NextResponse.json(desensitizedUserServerData);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request, res: NextApiResponse) {
  try {
    if (request.method !== "PATCH") {
      return new NextResponse("Method Incorrect");
    }

    const body = await request.json();
    const {
      serverProfileNickname,
      serverProfilePronouns,
      serverProfileAboutMe,
      currentServerImageUseAsId,
    } = body;
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const findServerIdUsingServerImage = await prismadb.server.findFirst({
      where: {
        imageUrl: currentServerImageUseAsId,
      },
    });

    const updatedServerProfileData = await prismadb.userServerData.update({
      where: {
        serverImage: findServerIdUsingServerImage?.imageUrl!,
        serverId: findServerIdUsingServerImage?.id!,
      },
      data: {
        serverProfileNickname,
        serverProfilePronouns,
        serverProfileAboutMe,
      },
    });

    const desensitizedUserServerData = desensitizeDatabaseData(
      "UserServerData",
      ["BannerColor"],
      updatedServerProfileData
    );

    return NextResponse.json(desensitizedUserServerData);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
