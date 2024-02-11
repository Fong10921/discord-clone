import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";

const getServerList = async () => {

  const { user } = await getCurrentUser()

  const serverList = await prismadb.server.findMany({
    where: {
      userId: user?.id,
    },
  });

  const desensitizatizedServer = desensitizeDatabaseData(
    "Server",
    [],
    serverList
  );

  return desensitizatizedServer
}

export default getServerList