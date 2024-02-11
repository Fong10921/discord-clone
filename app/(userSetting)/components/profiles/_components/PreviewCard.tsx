"use client";

import Timer from "@/components/Timer";
import UserProfileButton from "@/components/UserProfileButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image, { StaticImageData } from "next/image";
import pencilImage from "@/public/images/pencil.png";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { DesensitizedUserBannerColor } from "@/constants/types/types";

type previewState = {
  previewName?: string | null;
  previewNickname?: string;
  previewPronouns?: string | null;
  previewAboutMe?: string | null;
  previewUserName?: string;
  previewImage?: string | StaticImageData | undefined;
  previewBannerColor?: any;
};

interface UserProfilePreviewCardProps {
  previewState: previewState;
  userProfile: DesensitizedUserBannerColor;
  type: "server" | "user";
  userName: string;
}

const PreviewCard: React.FC<UserProfilePreviewCardProps> = ({
  previewState,
  userProfile,
  userName,
  type,
}) => {
  const isEmpty = (value: string | null | undefined | any[]) =>
  value === null || 
  value === undefined || 
  value === "" || 
  (Array.isArray(value) && value.length === 0);

  const [profileName, setProfileName] = useState<string | null>();
  const [profilePronouns, setProfilePronouns] = useState<string | null>();
  const [profileAboutMe, setProfileAboutMe] = useState<string | null>();

  const findActiveBannerColor = () => {
    let activeBannerColor;
    if (type === "user" || isEmpty(previewState.previewBannerColor)) {
      activeBannerColor = userProfile.bannerColor.find(
        (item: { isActive: boolean }) => item.isActive
      );
    } else if (type === "server") {
      activeBannerColor = previewState.previewBannerColor.find(
        (item: { isActive: boolean }) => item.isActive
      );
    }

    if (activeBannerColor === undefined) {
      return null;
    }

    return activeBannerColor;
  };

  useEffect(() => {
    const name = isEmpty(previewState.previewNickname || previewState.previewName)
      ? userProfile.name
      : previewState.previewName || previewState.previewNickname;
    const aboutMe = isEmpty(previewState.previewAboutMe)
      ? userProfile.aboutMe
      : previewState.previewAboutMe;
    const pronouns = isEmpty(previewState.previewPronouns)
      ? userProfile.pronouns
      : previewState.previewPronouns;

    setProfileName(name);
    setProfileAboutMe(aboutMe);
    setProfilePronouns(pronouns);
  }, [type, userProfile, previewState]);

  return (
    <div>
      <Card className="bg-[#232428] rounded-xl w-full flex-row mt-4">
        <div
          style={{
            backgroundColor: findActiveBannerColor()?.colorValue ?? "bg-black",
            height: "3.5rem",
          }}
          className="w-full block rounded-t-lg"
        />

        <div className="flex justify-between flex-1">
          <div className="flex items-center justify-center relative space-x-12">
            <UserProfileButton
              className="pl-14 -mt-7"
              width={70}
              height={70}
              showBadge={true}
              src={
                previewState.previewImage
                  ? previewState.previewImage
                  : userProfile.image!
              }
            />
          </div>
        </div>
        <CardContent className="mb-2">
          <div className="mt-5 p-3 mr-4 ml-4 bg-[#111214] flex flex-col space-x-2 rounded-lg overflow-hidden max-w-[340px]">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex flex-col w-full">
                <div className="text-lg font-bold whitespace-normal break-words max-w-[17rem]">
                  {profileName}
                </div>
                <div className="text-sm font-[550] whitespace-normal break-words max-w-[17rem]">
                  {userName}
                </div>
                <div className="text-sm font-[550] whitespace-normal break-words max-w-[17rem]">
                  {profilePronouns}
                </div>
                <div className="space-y-4">
                  <Separator className="my-2" />
                  {profileAboutMe && (
                    <div>
                      <div className="text-xs leading-1 tracking-wide mb-1 font-bold uppercase">
                        About Me
                      </div>
                      <div className="text-sm font-[550] whitespace-normal break-words max-w-[17rem]">
                        {profileAboutMe}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col space-y-2 mt-1">
                    <div className="text-xs tracking-wide mb-1 font-bold uppercase">
                      Customozing My Profile
                    </div>
                    <div className="flex flex-row">
                      <div
                        className={cn(
                          `rounded-lg max-w-[4rem] p-1`,
                          type === "server" ? "bg-[#11806a]" : "bg-indigo-600"
                        )}
                      >
                        <Image
                          src={pencilImage}
                          alt="Pencil Image"
                          width={80}
                          height={80}
                        />
                      </div>
                      <div className="flex flex-col justify-center ml-3">
                        <div className="text-sm">
                          {type === "server" ? "Server" : "User"} Profile
                        </div>
                        <div>
                          <Timer />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      className="w-full bg-[#4E5058] mb-1 text-white hover:bg-[#4E5058]/80 h-8 rounded-md"
                    >
                      Example Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewCard;
