import { NextResponse } from "next/server";
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
    email
  } = body;

  if (!email) {
    return new NextResponse("Email is required", { status: 400 });
  }

  const { user } = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existingEmail = await prismadb.user.findUnique({
    where: { email: email },
  });

  if (existingEmail) {
    return new NextResponse("Email already in use", { status: 409 });
  }

  const updatedEmail = await prismadb.user.update({
    where: {
      id: user?.id
    },
    data: {
      email: email
    }
  })

  return NextResponse.json(updatedEmail);
}

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
    email
  } = body;

  if (!email) {
    return new NextResponse("Email is required", { status: 400 });
  }

  const { user } = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existingEmail = await prismadb.user.findUnique({
    where: { email: email },
  });

  if (existingEmail) {
    return new NextResponse("Email already in use", { status: 409 });
  }

  const newEmail = await prismadb.user.create({
    data: {
      email: email
    }
  })

  return NextResponse.json(newEmail);
}