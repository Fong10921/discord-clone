import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";

const getServerDataWithBannerColor = async () => {
  const { user } = await getCurrentUser();
  try {
    const userServerDataWithBannerColor =
      await prismadb.userServerData.findMany({
        where: {
          id: user?.id,
        },
        include: {
          BannerColor: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    const userServerDataWithBannerColorDesensitized = desensitizeDatabaseData(
      "UserServerData",
      ["BannerColor"],
      userServerDataWithBannerColor
    );

    return userServerDataWithBannerColorDesensitized;
  } catch (error: any) {
    console.error("GET_SERVER_DATA_WITH_BANNER_COLOR_FAILED", {
      status: 500,
      error,
    });
    throw new Error(error.message || "Unknown error");
  }
};
export default getServerDataWithBannerColor;
