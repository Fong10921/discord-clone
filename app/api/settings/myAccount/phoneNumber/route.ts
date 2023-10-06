import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  res: NextApiResponse
) {

  if (req.method !== "PATCH") {
    res.status(404).end();
    return;
  }

  const body = await req.json();
  
  const {
    phoneNumber
  } = body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const { user } = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existingPhoneNumber = await prismadb.user.findUnique({
    where: {phoneNumber: phoneNumber },
  });

  if (existingPhoneNumber) {
    return new NextResponse("Phone Number is already in use", { status: 401 });
  }

  const updatePhoneNumber = await prismadb.user.update({
    where: {
      id: user?.id
    },
    data: {
      phoneNumber
    }
  })

  return NextResponse.json(updatePhoneNumber);
}

export async function GET(  
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== "GET") {
    res.status(404).end();
    return;
  }

  const { user } = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  };

  const userPhoneNumber = await prismadb.user.findUnique({
    where: {
      id: user.id
    },
    select: {
      phoneNumber: true,
    }
  });

  if (!userPhoneNumber) {
    return res.status(404).json({ message: 'Phone Number not found' });
  };

  return NextResponse.json(userPhoneNumber);
}