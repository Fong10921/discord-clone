import getCurrentUser from "@/actions/getCurrentUser";
import MyAccount from "../components/MyAccount";
import Profile from "../components/Profile";
import ESCButton from "../components/EscButton";
import prismadb from "@/lib/prismadb";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";
import getServerDataWithBannerColor from "@/actions/getServerDataWithBannerColor";

const SettingPage = async () => {
  const { user } = await getCurrentUser();
  const userServerDataWithBannerColor = await getServerDataWithBannerColor();

  const userWithBannerColor = await prismadb.user.findUnique({
    where: {
      id: user?.id,
    },
    include: {
      bannerColor: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

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

  const userWithBannerColorDesensitized = desensitizeDatabaseData(
    "User",
    ["BannerColor"],
    userWithBannerColor!
  );

  return (
    <div className="max-w-[35rem] flex">
      <div>
        <MyAccount user={user!} />
        <Profile
          data={userWithBannerColorDesensitized}
          data2={userServerDataWithBannerColor}
          data3={desensitizatizedServer}
        />
      </div>
      <ESCButton />
    </div>
  );
};

export default SettingPage;
