import getCurrentUser from "@/actions/getCurrentUser";
import ServerSideBar from "@/components/server/ServerSideBar";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

interface ServerLayoutProps {
  children: React.ReactNode,
  params: { serverId: string },
}

const ServerLayout: React.FC<ServerLayoutProps> = async ({
  children, params
}) => {

  const { user } = await getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user.id
        }
      }
    }
  })

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed hidden-below-md md:flex h-full w-60 z-20 flex-col inset-y-0">
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
};

export default ServerLayout;