import getCurrentUser from "@/actions/getCurrentUser";
import MyAccount from "../components/myAccount/MyAccount";
import Profile from "../components/profiles/Profile";
import ESCButton from "../components/EscButton";
import PrivacyAndSafety from "../components/privacyAndSafety/PrivacyAndSafety";
import getServerList from "@/actions/getServerList";
import getUserProfile from "@/actions/getUserProfile";
import getPrivacyAndSafety from "@/actions/getPrivacyAndSafety";
import FamilyCenter from "../components/familyCenter/FamilyCenter";

const SettingPage = async () => {
  const serverList = await getServerList();
  const userProfile = await getUserProfile();
  const privacySafety = await getPrivacyAndSafety();
  const { user } = await getCurrentUser();


  return (
    <div className="max-w-[35rem] flex">
      <div>
        <MyAccount user={user!} />
        <Profile
          initialUserProfile={userProfile}
          serverList={serverList}
          currentUser={user!}
        />
        <PrivacyAndSafety initialUserPrivacySafety={privacySafety!}/>
        <FamilyCenter />
      </div>
      <ESCButton />
    </div>
  );
};

export default SettingPage;
