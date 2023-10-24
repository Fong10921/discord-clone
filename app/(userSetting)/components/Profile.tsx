"use client";

import { useSettingPageModal } from "@/hooks/use-setting-page";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  getUserwithBannerColor,
  getUserServerDataWithBannerColor,
} from "@/utils/apiGetRequest";
import { useQuery } from "@tanstack/react-query";
import {
  BannerColorWithDesensitizedUsers,
  DesensitizationServer,
  DesensitizedUserServerDataWithDesensitizedBannerColor,
} from "@/constants/types/types";
import UserProfileForm from "./UserProfileForm";
import UserProfilePreviewCard from "./UserProfilePreviewCard";
import ChooseServerforServerProfile from "./ChooseServerforServerProfile";
import { Separator } from "@/components/ui/separator";
import ServerProfileForm from "./ServerProfileForm";

interface ProfileProps {
  data: BannerColorWithDesensitizedUsers | null;
  data2: DesensitizedUserServerDataWithDesensitizedBannerColor[] | null;
  data3: DesensitizationServer[] | null;
}

const Profile: React.FC<ProfileProps> = ({ data, data2, data3 }) => {
  const { openType } = useSettingPageModal();
  const [profile, setProfile] = useState("user");

  const {
    data: userBannerColorData,
    isFetching: isFetchingUserBannerColorData,
  } = useQuery(["userBannerColor"], getUserwithBannerColor, {
    initialData: data,
  });

  const {
    data: userServerDataWithBannerColor,
    isFetching: isFetchingUserServerDataWithBannerColor,
  } = useQuery(
    ["userServerDataBannerColor"],
    getUserServerDataWithBannerColor,
    {
      initialData: data2,
    }
  );

  const [previewStateForUserForm, setPreviewStateForUserForm] = useState({
    previewName: userBannerColorData.name,
    previewPronouns: userBannerColorData.pronouns,
    previewAboutMe: userBannerColorData.aboutMe,
    previewUserName: userBannerColorData.userName,
  });

  const [previewStateForServerForm, setPreviewStateForServerForm] = useState({
    previewNickName: userServerDataWithBannerColor.serverNickname,
    previewPronouns: userServerDataWithBannerColor.pronouns,
    previewImage: userServerDataWithBannerColor.serverImage,
    previewBannerColor: userServerDataWithBannerColor.bannerColor,
  })

  const [choosenServer, setChoosenServer] = useState({
    server: data3 ? data3[0] : null,
  });

  const handleChangeProfile = (profileString: string) => {
    if (profileString === profile) {
      return;
    } else {
      setProfile(profileString);
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
            onClick={() => handleChangeProfile("user")}
            className={cn(
              `mb-5 pb-4 text-base font-[600] whitespace-nowrap cursor-pointer border-b-2 border-transparent`,
              profile === "user" && "border-[#949CF7]"
            )}
          >
            User Profile
          </h1>
          <h1
            onClick={() => handleChangeProfile("server")}
            className={cn(
              `mb-5 pb-4 text-base font-[600] whitespace-nowrap cursor-pointer border-b-2 border-transparent`,
              profile === "server" && "border-[#949CF7]"
            )}
          >
            Server Profies
          </h1>
        </div>
        {profile === "user" && (
          <div className="flex flex-row">
            <div className="flex flex-col flex-1 w-[90%]">
              <h3 className="small-text-1232asd text-xs">Display Name</h3>
              <UserProfileForm
                userBannerColorData={userBannerColorData}
                isFetching={isFetchingUserBannerColorData}
                data={data}
                setPreviewState={setPreviewStateForUserForm}
              />
            </div>
            <div className="flex-1">
              <h3 className="small-text-1232asd">Preview</h3>
              <UserProfilePreviewCard
                previewState={previewStateForUserForm}
                userBannerColorData={userBannerColorData}
              />
            </div>
          </div>
        )}
        {profile === "server" && (
          <>
            <div className="w-full">
              <h3 className="small-text-1232asd text-xs">Choose a Server</h3>
              <div className="leading-[1.25rem] text-[0.88rem] font-normal cursor-default text-[#B5BAC1] w-full my-3">
                Show who you are with different profiles for each of your
                server. Learn more about Server Profiles
              </div>
              <ChooseServerforServerProfile
                userServerList={data3!}
                setChoosenServer={setChoosenServer}
              />
            </div>
            <Separator className="my-6 bg-[#4E5058] w-[90%]" />
            <div className="flex flex-row mt-3">
              <div className="flex flex-col flex-1 w-[90%]">
                <h3 className="small-text-1232asd text-xs">Server Nickname</h3>
                <ServerProfileForm
                  isFetching={isFetchingUserServerDataWithBannerColor}
                  currentChoosenServer={choosenServer.server ?? null}
                  setPreviewStateForServer={setPreviewStateForServerForm}
                  userServerDataWithBannerColor={userServerDataWithBannerColor}
                />
              </div>
              <div className="flex-1">
                <h3 className="small-text-1232asd">Preview for</h3>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
