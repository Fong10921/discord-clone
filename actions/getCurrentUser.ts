import prisma from "@/lib/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return {
      user: null,
      id: null,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      }
    });

    if (!user) {
      return {
        user: null,
        id: null,
      };
    };
    return { user, id: user.id, phoneNumber: user.phoneNumber };
  } catch (error: any) {
    console.log("GET_CURRENT_USER_FAILED", { status: 500 });
    return { user: null, id: null };
  }
}

export default getCurrentUser