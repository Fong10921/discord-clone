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
    const { name, pronouns, aboutMe } = body;
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const updatedUser = await prismadb.user.update({
      where: { id: user?.id },
      data: {
        name,
        pronouns,
        aboutMe
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