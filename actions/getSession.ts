import { getServerSession } from "next-auth";
import { NextApiRequest } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { IncomingMessage, ServerResponse } from "http";

export default async function getSession(req?: NextApiRequest) {
  const mockRes = { getHeader() {}, setCookie() {}, setHeader() {} } as unknown as ServerResponse<IncomingMessage>;

  if (req) {
    return await getServerSession(req, mockRes, authOptions);
  } else {
    return await getServerSession(authOptions);
  }
}


