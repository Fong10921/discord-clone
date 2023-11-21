import getCurrentUser from "@/actions/getCurrentUser";
import MyAccount from "../components/myAccount/MyAccount";
import Profile from "../components/profiles/Profile";
import ESCButton from "../components/EscButton";
import prismadb from "@/lib/prismadb";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";
import PrivacyAndSafety from "../components/privacyAndSafety/PrivacyAndSafety";

const SettingPage = async () => {
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

  const desensitizedUserProfile  = desensitizeDatabaseData(
    "User",
    ["BannerColor"],
    userWithBannerColor!
  );

  return (
    <div className="max-w-[35rem] flex">
      <div>
        <MyAccount user={user!} />
        <Profile
          initialUserProfile={desensitizedUserProfile}
          serverList={desensitizatizedServer}
          currentUser={user!}
        />
        <PrivacyAndSafety />
      </div>
      <ESCButton />
    </div>
  );
};

export default SettingPage;
