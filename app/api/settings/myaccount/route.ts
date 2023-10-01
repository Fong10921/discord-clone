import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { NextApiResponse } from "next";
import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  request: Request,
  res: NextApiResponse
) {

  if (request.method !== "PATCH") {
    res.status(404).end();
    return;
  }

  const body = await request.json();
  
  const {
    username,
    password
  } = body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const { user } = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const passwordCorrect = await bcrypt.compare(password, user.hashedPassword!);

  if (!passwordCorrect) {
    return new NextResponse("Password is incorrect", { status: 401 });
  }

  const existingUsername = await prismadb.user.findUnique({
    where: { userName: username },
  });

  if (existingUsername) {
    return new NextResponse("Username already in use", { status: 401 });
  }

  const updatedUsername = await prismadb.user.update({
    where: {
      id: user?.id
    },
    data: {
      userName: username
    }
  })

  return NextResponse.json(updatedUsername);
}