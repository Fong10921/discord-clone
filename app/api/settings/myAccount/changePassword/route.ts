import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PATCH(request: Request, res: NextApiResponse) {
  try {
    if (request.method !== "PATCH") {
      return new NextResponse("Method Incorrect");
    }
  
    const body = await request.json();
    const { currentPassword, newPassword, confirmNewPassword } = body;
    const { user } = await getCurrentUser();
  
    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const isCorrectPassword = await bcrypt.compare(
      currentPassword,
      user.hashedPassword!
    );

    if (!isCorrectPassword) {
      return new NextResponse("The current password you entered is wrong please check again.");
    };

    if (newPassword !== confirmNewPassword) {
      return new NextResponse("Please make sure the new password you entered match");
    }

    const hashedPassword = await bcrypt.hash(confirmNewPassword, 12)

    const updateUserPassword = await prismadb.user.update({
      where: {
        id: user.id
      },
      data: {
        hashedPassword: hashedPassword
      }
    })
  
    return NextResponse.json(updateUserPassword);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}  