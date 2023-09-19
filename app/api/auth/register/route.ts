import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/prismadb";
import { NextApiResponse } from "next";

export async function POST(
  request: Request,
  res: NextApiResponse
) {

  if (request.method !== "POST") {
    res.status(404).end();
    return;
  }

  const body = await request.json();
  
  const {
    email,
    name,
    password
  } = body;

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email
    }
  })

  if (existingUser) {
    throw new Error("User already existed")
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      emailVerified: new Date(),
      image: "",
    }
  })

  return NextResponse.json(user);
}