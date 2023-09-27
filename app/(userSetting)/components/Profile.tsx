"use client";

import { useSettingPageModal } from "@/hooks/use-setting-page";

const Profile = () => {
  const { openType } = useSettingPageModal();

  if (openType !== "profile") {
    return;
  }

  return <div className="">Profile</div>;
};

export default Profile;
