import getCurrentUser from "@/actions/getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";
import prismadb from "@/lib/prismadb";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const bannerColor = await prismadb.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        bannerColor: {
          where: {
            userId: user?.id,
            userServerId: null,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const desensitizatizedBannerColor = desensitizeDatabaseData(
      "User",
      ["BannerColor"],
      bannerColor!
    );

    return NextResponse.json(desensitizatizedBannerColor);
  } catch (error) {
    console.log("[GET_CURRENT_USER_WITH_BANNER_COLOR_API FAILED]");
    console.log(error);
  }
}

export async function POST(request: Request, res: NextApiResponse) {
  if (request.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const body = await request.json();
    const { bannerColor } = body;
    let { isActive } = body;

    const { user } = await getCurrentUser();

    if (!user) {
      return res.status(401).send("Unauthenticated");
    }

    if (isActive === true) {
      const activeBannerColor = await prismadb.bannerColor.findFirst({
        where: {
          userId: user.id,
          isActive: true,
        },
      });

      if (activeBannerColor) {
        await prismadb.bannerColor.update({
          where: {
            id: activeBannerColor.id,
          },
          data: {
            isActive: false,
          },
        });
      }
    }

    if (isActive === "unchecked") {
      isActive = false;
    }

    const newBannerColor = await prismadb.bannerColor.create({
      data: {
        colorValue: bannerColor.hex,
        isActive: isActive,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const data = desensitizeDatabaseData("BannerColor", [], newBannerColor);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
}

export async function PATCH(request: Request, res: NextApiResponse) {
  try {
    if (request.method !== "PATCH") {
      return new NextResponse("Method Incorrect");
    }

    const body = await request.json();
    const { bannerColor, isActive, oldColorValue } = body;
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const bannerColorToBeUpdated = await prismadb.bannerColor.findUnique({
      where: {
        userId_colorValue: {
          userId: user?.id,
          colorValue: oldColorValue,
        },
      },
    });

    if (isActive === true) {
      const activeBannerColor = await prismadb.bannerColor.findFirst({
        where: {
          userId: user.id,
          isActive: true,
        },
      });


      if (activeBannerColor) {
        await prismadb.bannerColor.update({
          where: {
            id: activeBannerColor.id,
          },
          data: {
            isActive: false,
          },
        });
      }
    }

    if (!bannerColorToBeUpdated || bannerColorToBeUpdated.userId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedBannerColor = await prismadb.bannerColor.update({
      where: {
        userId_colorValue: {
          userId: user?.id,
          colorValue: oldColorValue,
        },
      },
      data: {
        colorValue: bannerColor.hex,
        isActive: isActive === "unchecked" ? bannerColorToBeUpdated.isActive : isActive,
      },
    });

    return NextResponse.json(updatedBannerColor);
  } catch (error) {
    console.error("Error caught in PATCH:", error); // Log any caught errors
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request, res: NextApiResponse) {
  try {
    if (request.method !== "DELETE") {
      return new NextResponse("Method Incorrect");
    }

    const body = await request.json();

    const { oldColorValue } = body;

    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const bannerColor = await prismadb.bannerColor.findUnique({
      where: {
        userId_colorValue: {
          userId: user?.id,
          colorValue: oldColorValue,
        },
      },
    });

    if (!bannerColor || bannerColor.userId !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prismadb.bannerColor.delete({
      where: {
        id: bannerColor.id,
      },
    });

    return NextResponse.json("Sucessfully deleted");
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
