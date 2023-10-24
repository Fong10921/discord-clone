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
    const { imageUrl } = body;
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const updatedUser = await prismadb.user.update({
      where: { id: user?.id },
      data: {
        image: imageUrl,
      },
    });

    const desensitizeUserData = desensitizeDatabaseData(
      "User",
      [],
      updatedUser
    );

    return NextResponse.json(desensitizeUserData);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request, res: NextApiResponse) {
  try {
    console.log("trying")
    if (request.method !== "DELETE") {
      return new NextResponse("Method Incorrect");
    }

    const body = await request.json();

    const { values } = body;

    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const findUserWithImage = await prismadb.user.findUnique({
      where: {
        id: user?.id,
        image: values,
      },
    });

    if (!findUserWithImage) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prismadb.user.update({
      where: {
        id: user?.id,
      },
      data: {
        image: "",
      },
    });

    return NextResponse.json("Sucessfully deleted");
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
