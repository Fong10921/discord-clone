"use client";

import UserCard from "@/components/UserCard";
import { useSettingPageModal } from "@/hooks/use-setting-page";
import { User } from "@prisma/client";

interface MyAccountProps {
  user: User
}

const MyAccount: React.FC<MyAccountProps> = ({
  user
}) => {
  const { openType } = useSettingPageModal();

  if (openType !== "myAccount") {
    return;
  }

  return (
    <div className="w-full">
      <div className="mb-5 font-bold text-xl w-full">My Account</div>
      <UserCard user={user}/>
    </div>
  )
};

export default MyAccount;
