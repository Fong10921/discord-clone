import prisma from "@/lib/prismadb";
import getSession from "./getSession";

const getCurrentUser = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    console.error('No session or email found');
    return { error: 'No session or email found' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      }
    });

    if (!user) {
      console.error('User not found');
      return { error: 'User not found' };
    }
    
    return { user, id: user.id, phoneNumber: user.phoneNumber };
    
  } catch (error: any) {
    console.error("GET_CURRENT_USER_FAILED", { status: 500, error });
    return { error: error.message || 'Unknown error' };
  }
}

export default getCurrentUser;
