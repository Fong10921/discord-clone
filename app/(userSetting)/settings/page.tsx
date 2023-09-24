"use client"

import MyAccount from "../components/MyAccount";
import Profile from "../components/Profile";

interface SettingPageProps {
}

const SettingPage = () => {
  return (
    <div>
      <MyAccount />
      <Profile />
    </div>
  );
};

export default SettingPage;