import getCurrentUser from "@/actions/getCurrentUser";
import MyAccount from "../components/MyAccount";
import Profile from "../components/Profile";
import ESCButton from "../components/EscButton";
import prismadb from "@/lib/prismadb";

const SettingPage = async () => {
  const { user } = await getCurrentUser();

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

  return (
    <div className="max-w-[35rem] flex flex-row">
      <div className="relative px-10 pt-[3.75rem] pb-16 flex flex-1 max-h-[740px] min-w-[45rem] min-h-full ">
        <MyAccount user={user!} />
        <Profile data={userWithBannerColor} />
      </div>
      <ESCButton />
    </div>
  );
};

export default SettingPage;
