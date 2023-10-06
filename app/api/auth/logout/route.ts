import getSession from "@/actions/getSession";
import { signOut } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await getSession();

    if (!session) {
        return new NextResponse("Not Login", { status: 401 });
    };

    signOut({ callbackUrl: "/", redirect: true });

    return NextResponse.json("Signed Out successfully", { status: 200 });
}