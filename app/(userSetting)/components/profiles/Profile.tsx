"use client";

import { useSettingPageModal } from "@/hooks/use-setting-page";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { fetchUserWithBannerColor } from "@/utils/apiGetRequest";
import { useQuery } from "@tanstack/react-query";
import {
  DesensitizedUserBannerColor,
  DesensitizationServer,
} from "@/constants/types/types";
import { User } from "@prisma/client";
import ServerProfile from "./_components/ServerProfile";
import UserProfile from "./_components/UserProfile";

interface ProfileProps {
  initialUserProfile: DesensitizedUserBannerColor;
  serverList: DesensitizationServer[];
  currentUser: User;
}

const Profile: React.FC<ProfileProps> = ({
  initialUserProfile,
  serverList,
  currentUser,
}) => {
  const { openType } = useSettingPageModal();
  const [profileType, setProfileType] = useState("user");

  const { data: userProfile, isFetching: isFetchingUserProfile } = useQuery({
    queryKey: ["userBannerColor"],
    queryFn: fetchUserWithBannerColor,
    initialData: initialUserProfile,
  });


  const handleProfileTypeChange = (profileString: string) => {
    if (profileString === profileType) {
      return;
    } else {
      setProfileType(profileString);
    }
  };

  if (openType !== "profile") {
    return;
  }

  return (
    <div className="relative pl-10 pb-6 pt-[3.75rem] flex flex-1 max-h-[740px] min-w-[45rem] min-h-full ">
      <div className="w-full">
        <div className="mb-5 font-bold text-xl w-full">Profile</div>
        <div className="flex flex-row space-x-12 flex-1">
          <h1
            onClick={() => handleProfileTypeChange("user")}
            className={cn(
              `mb-5 pb-4 text-base font-[600] whitespace-nowrap cursor-pointer border-b-2 border-transparent`,
              profileType === "user" && "border-[#949CF7]"
            )}
          >
            User Profile
          </h1>
          <h1
            onClick={() => handleProfileTypeChange("server")}
            className={cn(
              `mb-5 pb-4 text-base font-[600] whitespace-nowrap cursor-pointer border-b-2 border-transparent`,
              profileType === "server" && "border-[#949CF7]"
            )}
          >
            Server Profies
          </h1>
        </div>
        {profileType === "user" && (
          <UserProfile
            userProfile={userProfile}
            currentUser={currentUser}
            isFetchingUserProfile={isFetchingUserProfile}
          />
        )}
        {profileType === "server" && (
          <ServerProfile
            serverList={serverList}
            initialUserProfile={initialUserProfile}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
