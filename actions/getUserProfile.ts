import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";

const getUserProfile = async () => {

  const { user } = await getCurrentUser();

  const userWithBannerColor = await prismadb.user.findUnique({
    where: {
      id: user?.id,
    },
    include: {
      bannerColor: {
        where: {
          userServerId: null
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const desensitizedUserProfile  = desensitizeDatabaseData(
    "User",
    ["BannerColor"],
    userWithBannerColor!
  );

  return desensitizedUserProfile;
}

export default getUserProfile