import getCurrentUser from "@/actions/getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const userServerDataWithBannerColor = await prismadb.userServerData.findMany({
      where: {
        id: user?.id,
      },
      include: {
        BannerColor: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    console.log(userServerDataWithBannerColor)

    const userServerDataWithBannerColorDesensitized = desensitizeDatabaseData(
      "UserServerData",
      ["BannerColor"],
      userServerDataWithBannerColor
    );

    console.log(userServerDataWithBannerColorDesensitized)
  

    return NextResponse.json(userServerDataWithBannerColorDesensitized);
  } catch (error) {
    console.log("[GET_USER_SERVER_DATA_WITH_BANNER_COLOR_API FAILED]");
  }
}
