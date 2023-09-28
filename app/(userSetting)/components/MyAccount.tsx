"use client";

import UserCard from "@/components/UserCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSettingPageModal } from "@/hooks/use-setting-page";
import { User } from "@prisma/client";

interface MyAccountProps {
  user: User;
}

const MyAccount: React.FC<MyAccountProps> = ({ user }) => {
  const { openType } = useSettingPageModal();

  if (openType !== "myAccount") {
    return;
  }

  return (
    <div className="w-full">
      <div className="mb-5 font-bold text-xl w-full">My Account</div>
      <UserCard user={user} />
      <Separator className="space-y-12 my-12 w-full bg-[#4E5058]" />
      <div>
        <div>
          <h1 className="mb-5 font-bold text-xl w-full">
            Password and Authentication
          </h1>
          <Button className="mt-3 mr-3 mb-5 text-sm py-0 tracking-wide px-4 bg-[#5865F2] text-white font-[590] h-8 rounded-none hover:bg-[#4752C4]">
            Change Password
          </Button>
          <h3 className="small-text-1232asd">Two-Factor Authentication</h3>
          <div className="leading-[1.25rem] text-[0.88rem] font-normal cursor-default text-[#B5BAC1] w-[75%] mt-3">
            Protect your Discord account with an extra layer of security. Once
            configured, you&apos;ll be required to enter both password and an
            authenticated code from your mobile phone in order to sign in.
          </div>
          <Button className="mt-5 mr-3 text-sm py-0 tracking-wide px-4 bg-[#5865F2] text-white font-[590] h-8 rounded-none hover:bg-[#4752C4]">
            Enable Two-Factor Auth
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
