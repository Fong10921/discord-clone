import getSession from "@/actions/getSession";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();

        if (!session?.user?.email) {
            return {
                user: null,
                id: null,
            }
        };

        const user = await prismadb.user.findUnique({
            where: {
                email: session?.user?.email as string,
            }
        });

        if (!user) {
            return {
                user: null,
                id: null,
            };
        };

        return NextResponse.json(user);
    } catch (error) {
        console.log("[GET_CURRENT_USER API FAILED]")
    }
}