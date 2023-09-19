import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

interface ServerPageProps {
  params: {
    serverId: string
  }
}

const ServerIdPage: React.FC<ServerPageProps> = async ({
  params
}) => {

  const { user } = await getCurrentUser();
  
  if (!user) {
    return redirect("/")
  };

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: user.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: "general"
        },
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  })

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
};

export default ServerIdPage;