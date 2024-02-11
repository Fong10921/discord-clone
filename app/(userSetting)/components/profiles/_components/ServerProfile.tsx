"use client";

import { Separator } from "@/components/ui/separator";
import {
  DesensitizationServer,
  DesensitizedUserBannerColor,
} from "@/constants/types/types";
import { useEffect, useRef, useState } from "react";
import ChooseServerforServerProfile from "./ChooseServerforServerProfile";
import ServerProfileForm from "./ServerProfileForm";
import placeholderImage from "@/public/images/placeholder.png";
import { fetchUserServerDataWithBannerColor } from "@/utils/apiGetRequest";
import { useQuery } from "@tanstack/react-query";
import { useServerData } from "@/utils/useAsync";
import PreviewCard from "./PreviewCard";
import { User } from "@prisma/client";

interface ServerProfileProps {
  serverList: DesensitizationServer[];
  initialUserProfile: DesensitizedUserBannerColor;
  currentUser: User;
}

const ServerProfile: React.FC<ServerProfileProps> = ({
  serverList,
  initialUserProfile,
  currentUser,
}) => {
  const [selectedServer, setSelectedServer] = useState(serverList[0]);
  const [activeUserServerProfileData, setActiveUserServerProfileData] =
    useState<any>();
  const [nowSettingData, setNowSettingData] = useState(false);

  const prevValueRef = useRef();

  const { data: initialUserServerProfile } = useServerData(
    selectedServer.imageUrl
  );

  const { data: userServerProfile, isFetching: isFetchingUserServerProfile } =
    useQuery({
      queryKey: ["userServerDataBannerColor", selectedServer.imageUrl],
      queryFn: fetchUserServerDataWithBannerColor,
      initialData: initialUserServerProfile,
    });

  const [serverProfilePreviewState, setUserServerProfilePreview] = useState({
    previewNickname: userServerProfile?.[0]?.serverProfileNickname,
    previewPronouns: userServerProfile?.[0]?.serverProfilePronouns,
    previewAboutMe: userServerProfile?.[0]?.serverProfileAboutMe,
    previewImage: initialUserProfile.image ?? placeholderImage,
    previewBannerColor: userServerProfile?.bannerColor,
  });

  const emptyServerProfileData = {
    serverProfileNickname: "",
    serverProfilePronouns: "",
    serverProfileAboutMe: "",
    serverImage: selectedServer.imageUrl,
  };

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
          previewImage: initialUserProfile.image ?? placeholderImage,
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
            previewBannerColor: matchedServerData.bannerColor,
          });
          prevValueRef.current = matchedServerData;
        }
      }
    }
    setNowSettingData(false);
  }, [selectedServer, userServerProfile]);

  return (
    <>
      <div className="w-full">
        <h3 className="small-text-1232asd text-xs">Choose a Server</h3>
        <div className="leading-[1.25rem] text-[0.88rem] font-normal cursor-default text-[#B5BAC1] w-full my-3">
          Show who you are with different profiles for each of your server.
          Learn more about Server Profiles
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
  );
};

export default ServerProfile;
