"use client";

import UserProfileButton from "./UserProfileButton";
import { User } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useSettingPageModal } from "@/hooks/use-setting-page";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { onOpen } = useSettingPageModal();
  const { onOpen: onOpenModal } = useModal();
  const [hideEmail, setHideEmail] = useState(true);

  const handleClickRedirectToProfileSetting = () => {
    onOpen("profile");
  }

  const handleClickOpenUsernameModal = () => {
    onOpenModal("editUsername")
  }

  const handleClickOpenPhoneNumberModal = () => {
    onOpenModal("phoneNumber", { user })
  }

  const handleClickOpenEmailModal = () => {
    onOpenModal("email", { user })
  }

  const getHiddenEmail = (email: string | undefined) => {
    if (email && email.includes("@")) {
      const [localPart, domain] = email.split("@");
      const hiddenLocalPart = localPart.replace(/./g, '*');
      return `${hiddenLocalPart}@${domain}`;
    }
    return email;
  }

  const handleEmailReveal = () => {
    setHideEmail(!hideEmail);
  };

  return (
    <div>
      <Card className="bg-black rounded-2xl w-full flex-row h-[30rem]">
        <div
          style={{ backgroundColor: "rgb(105, 93, 93)" }}
          className="w-full block h-[6.5rem] rounded-t-2xl"
        />
        <div className="flex justify-between flex-1">
          <div className="flex items-center justify-center relative space-x-12">
            <UserProfileButton
              className="pl-14 -mt-5"
              width={80}
              height={80}
              showBadge={true}
            />
            <div className="pl-1 text-[1.25rem] font-bold ">{user?.name}</div>
          </div>
          <Button className="mt-3 mr-4 text-sm py-0 tracking-wide px-4 text-white font-[590] h-8 rounded-none" variant="primary_discord_blue">
            Edit User Profile
          </Button>
        </div>
        <CardContent>
          <div className="mt-9 p-4 mr-4 ml-4 bg-[#2B2D31] flex flex-col space-x-2 rounded-xl">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex flex-row justify-between w-full items-center">
                <div>
                  <p className="text-xs mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] uppercase">
                    Display Name
                  </p>
                  {user.name}
                </div>
                <Button onClick={handleClickRedirectToProfileSetting} className="bg-[#4E5058] hover:bg-[#6D6F78] text-white h-8 rounded-none">
                  {user.name ? "Edit" : "Add"}
                </Button>
              </div>
              <div className="flex flex-row justify-between w-full items-center">
                <div className="items-stretch flex flex-col">
                  <p className="text-xs mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] uppercase">
                    USERNAME
                  </p>
                  {user?.userName || ''}
                </div>
                <Button onClick={handleClickOpenUsernameModal} className="bg-[#4E5058] hover:bg-[#6D6F78] text-white h-8 rounded-none">
                  {user.userName ? "Edit" : "Add"}
                </Button>
              </div>
              <div className="flex flex-row justify-between w-full items-center">
                <div>
                  <p className="text-xs mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] uppercase">
                    EMAIL
                  </p>
                  {hideEmail ? getHiddenEmail(user?.email!) : user?.email}
                </div>
                <p onClick={handleEmailReveal} className="cursor-pointer underline text-blue-500 text-xs mr-80">
                  {hideEmail ? "Reveal" : "Hide"}
                </p>
                <Button onClick={handleClickOpenEmailModal} className="bg-[#4E5058] hover:bg-[#6D6F78] text-white h-8 rounded-none">
                  {user.email ? "Edit" : "Add"}
                </Button>
              </div>
              <div className="flex flex-row justify-between w-full items-center">
                <div>
                  <p className="text-xs mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] uppercase">
                    PHONE NUMBER
                  </p>
                  {user.phoneNumber ? user.phoneNumber : <span>You haven&apos;t added a phone number yet</span>}
                </div>
                <Button onClick={handleClickOpenPhoneNumberModal} className="bg-[#4E5058] hover:bg-[#6D6F78] text-white h-8 rounded-none">
                  {user.phoneNumber ? "Edit" : "Add"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;
