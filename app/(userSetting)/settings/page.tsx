import getCurrentUser from "@/actions/getCurrentUser";
import MyAccount from "../components/MyAccount";
import Profile from "../components/Profile";
import ESCButton from "../components/EscButton";

const SettingPage = async () => {

  const { user } = await getCurrentUser();

  return (
    <div className="max-w-[35rem] flex flex-row">
      <div className="relative px-10 pt-[3.75rem] pb-16 flex flex-1 max-h-[740px] min-w-[45rem] min-h-full ">
        <MyAccount user={user!} />
        <Profile />
      </div>
      <ESCButton />
    </div>

  );
};

export default SettingPage;