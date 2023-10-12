import prismadb from "@/lib/prismadb";
import AuthForm from "./components/AuthForm";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import InitialModal from "@/components/models/initialModal";

export default async function Home() {
  let user, server, content;

  try {
    const result = await getCurrentUser();
    user = result?.user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    // You might want to set some state here to show an error message to the user
  }

  try {
    if (user) {
      server = await prismadb.server.findFirst({
        where: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error('Error fetching server:', error);
    // You might want to set some state here to show an error message to the user
  }

  if (!user && !server) {
    content = <AuthForm />;
  }

  if (user && !server) {
    content = <InitialModal />;
  }

  if (user && server) {
    return redirect(`/servers/${server?.id}`);
  }

  return (
    <div className="bg-gradient-to-r from-black to-gray-800 flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full dark:bg-black bg-[#F2F3F5] sm:max-w-md rounded-lg">
        {content}
      </div>
    </div>
  );
}
