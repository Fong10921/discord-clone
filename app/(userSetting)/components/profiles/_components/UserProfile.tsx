"use client";

import { UsersWithBannerColor } from "@/constants/types/types";
import PreviewCard from "./PreviewCard";
import UserProfileForm from "./UserProfileForm";
import { useState } from "react";
import { User } from "@prisma/client";

interface UserProfileProps {
  userProfile: UsersWithBannerColor;
  isFetchingUserProfile: boolean;
  currentUser: User;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userProfile,
  isFetchingUserProfile,
  currentUser
}) => {

  const [userProfilePreviewState, setUserProfilePreview] = useState({
    previewName: userProfile.name,
    previewPronouns: userProfile.pronouns,
    previewAboutMe: userProfile.aboutMe,
  });

  return (
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
  );
};

export default UserProfile;
