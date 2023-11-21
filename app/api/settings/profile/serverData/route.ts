import getCurrentUser from "@/actions/getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";

export async function GET(request: NextApiRequest) {
  try {
    const { user } = await getCurrentUser();
    const choosenServerImage = request.query?.choosenServerImage;

    let userServerDataWithBannerColor;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (choosenServerImage) {
      userServerDataWithBannerColor = await prismadb.userServerData.findFirst({
        where: {
          serverImage: choosenServerImage as string,
        },
        include: {
          bannerColor: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    } else {
      userServerDataWithBannerColor = await prismadb.userServerData.findMany({
        where: {
          userId: user?.id,
        },
        include: {
          bannerColor: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    }

    const userServerDataWithBannerColorDesensitized = desensitizeDatabaseData(
      "UserServerData",
      ["BannerColor"],
      userServerDataWithBannerColor
    );

    return NextResponse.json(userServerDataWithBannerColorDesensitized);
  } catch (error) {
    console.log(error);
    console.log("[GET_USER_SERVER_DATA_WITH_BANNER_COLOR_API FAILED]");
  }
}
