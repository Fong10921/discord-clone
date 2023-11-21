"use client";

import { useSettingPageModal } from "@/hooks/use-setting-page";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  fetchUserWithBannerColor,
  fetchUserServerDataWithBannerColor,
} from "@/utils/apiGetRequest";
import { useQuery } from "@tanstack/react-query";
import {
  DesensitizedUserBannerColor,
  DesensitizationServer,
} from "@/constants/types/types";
import UserProfileForm from "./UserProfileForm";
import ChooseServerforServerProfile from "./ChooseServerforServerProfile";
import { Separator } from "@/components/ui/separator";
import ServerProfileForm from "./ServerProfileForm";
import { User } from "@prisma/client";
import { useServerData } from "@/utils/useAsync";
import PreviewCard from "./PreviewCard";

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
  const [activeUserServerProfileData, setActiveUserServerProfileData] =
    useState<any>();
  const [selectedServer, setSelectedServer] = useState(serverList[0]);
  const [nowSettingData, setNowSettingData] = useState(false);
  const emptyServerProfileData = {
    serverProfileNickname: "",
    serverProfilePronouns: "",
    serverProfileAboutMe: "",
    serverImage: selectedServer.imageUrl,
  };

  const { data: initialUserServerProfile } = useServerData(
    selectedServer.imageUrl
  );

  const { data: userProfile, isFetching: isFetchingUserProfile } = useQuery(
    ["userBannerColor"],
    fetchUserWithBannerColor,
    {
      initialData: initialUserProfile,
    }
  );

  const { data: userServerProfile, isFetching: isFetchingUserServerProfile } =
    useQuery(
      ["userServerDataBannerColor", selectedServer.imageUrl],
      fetchUserServerDataWithBannerColor,
      {
        initialData: initialUserServerProfile,
      }
    );

  const [userProfilePreviewState, setUserProfilePreview] = useState({
    previewName: userProfile.name,
    previewPronouns: userProfile.pronouns,
    previewAboutMe: userProfile.aboutMe,
  });

  const [serverProfilePreviewState, setUserServerProfilePreview] = useState({
    previewNickname: userServerProfile?.[0]?.serverProfileNickname,
    previewPronouns: userServerProfile?.[0]?.serverProfilePronouns,
    previewAboutMe: userServerProfile?.[0]?.serverProfileAboutMe,
    previewImage: initialUserProfile.image,
    previewBannerColor: userServerProfile?.bannerColor,
  });

  const prevValueRef = useRef();

  useEffect(() => {
    setNowSettingData(true);

    if (userServerProfile && selectedServer) {
      const matchedServerData = userServerProfile.find(
        (server: { serverImage: string }) => {
          return server.serverImage === selectedServer.imageUrl;
        }
      );

      if (matchedServerData === undefined) {
        setActiveUserServerProfileData(emptyServerProfileData);
        setUserServerProfilePreview({
          previewNickname: null,
          previewPronouns: null,
          previewAboutMe: null,
          previewImage: initialUserProfile.image,
          previewBannerColor: initialUserProfile.bannerColor,
        });
      } else {
        if (prevValueRef.current !== matchedServerData) {
          setActiveUserServerProfileData(matchedServerData);
          setUserServerProfilePreview({
            previewNickname: matchedServerData.serverProfileNickname,
            previewPronouns: matchedServerData.serverProfilePronouns,
            previewAboutMe: matchedServerData.serverProfileAboutMe,
            previewImage: matchedServerData.serverProfileImage,
            previewBannerColor: matchedServerData.bannerColor
          });
          // Update the ref with the new value
          prevValueRef.current = matchedServerData;
        }
      }
    }
    setNowSettingData(false);
  }, [selectedServer, userServerProfile]);

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
          <div className="flex flex-row">
            <div className="flex flex-col flex-1 w-[90%]">
              <h3 className="small-text-1232asd text-xs">Display Name</h3>
              <UserProfileForm
                userProfile={userProfile}
                isFetching={isFetchingUserProfile}
                setPreviewState={setUserProfilePreview}
              />
            </div>
            <div className="flex-1">
              <h3 className="small-text-1232asd">Preview</h3>
              <PreviewCard
                type="user"
                userName={currentUser.userName!}
                previewState={userProfilePreviewState}
                userProfile={userProfile}
              />
            </div>
          </div>
        )}
        {profileType === "server" && (
          <>
            <div className="w-full">
              <h3 className="small-text-1232asd text-xs">Choose a Server</h3>
              <div className="leading-[1.25rem] text-[0.88rem] font-normal cursor-default text-[#B5BAC1] w-full my-3">
                Show who you are with different profiles for each of your
                server. Learn more about Server Profiles
              </div>
              <ChooseServerforServerProfile
                userServerList={serverList}
                choosenServer={selectedServer}
                setChoosenServer={setSelectedServer}
              />
            </div>
            <Separator className="my-6 bg-[#4E5058] w-[90%]" />
            <div className="flex flex-row mt-3">
              <div className="flex flex-col flex-1 w-[90%]">
                <h3 className="small-text-1232asd text-xs">Server Nickname</h3>
                {activeUserServerProfileData && !nowSettingData && (
                  <ServerProfileForm
                    key={activeUserServerProfileData.serverImage}
                    isFetching={isFetchingUserServerProfile}
                    setPreviewStateForServer={setUserServerProfilePreview}
                    selectedServerData={activeUserServerProfileData}
                    user={currentUser}
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="small-text-1232asd">
                  Preview for {selectedServer.name}
                </h3>
                {activeUserServerProfileData && !nowSettingData && (
                  <PreviewCard
                    type="server"
                    userName={currentUser.userName!}
                    previewState={serverProfilePreviewState}
                    userProfile={initialUserProfile}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
