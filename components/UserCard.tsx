"use client";

import UserProfileButton from "./UserProfileButton";
import { User } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
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
              className="pl-16 -mt-5"
              width={80}
              height={80}
              showBadge={true}
            />
            <div className="pl-1 text-[1.25rem] font-bold ">{user?.name}</div>
          </div>
          <Button className="mt-3 mr-3 text-sm py-0 tracking-wide px-4 bg-[#5865F2] text-white font-[590] h-8 rounded-none hover:bg-[#4752C4]">
            Edit User Profile
          </Button>
        </div>
        <CardContent>
          <div className="mt-9 p-4 mr-3 ml-5 bg-[#2B2D31] flex flex-col space-x-2 rounded-xl">
            <div className="flex flex-col items-center space-y-6">
              <div className="flex flex-row justify-between w-full items-center">
                <div>
                  <p className="text-xs mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] uppercase">
                    Display Name
                  </p>
                  {user.name}
                </div>
                <Button className="bg-[#4E5058] hover:bg-[#6D6F78] text-white h-8 rounded-none">
                  Edit
                </Button>
              </div>
              <div className="flex flex-row justify-between w-full items-center">
                <div>
                  <p className="text-xs mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] uppercase">
                    USERNAME
                  </p>
                  {user.name}
                </div>
                <Button className="bg-[#4E5058] hover:bg-[#6D6F78] text-white h-8 rounded-none">
                  Edit
                </Button>
              </div>
              <div className="flex flex-row justify-between w-full items-center">
                <div>
                  <p className="text-xs mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] uppercase">
                    EMAIL
                  </p>
                  {user?.email}
                </div>
                <Button className="bg-[#4E5058] hover:bg-[#6D6F78] text-white h-8 rounded-none">
                  Edit
                </Button>
              </div>
              <div className="flex flex-row justify-between w-full items-center">
                <div>
                  <p className="text-xs mb-1 font-bold tracking-[0.02em] text-[#B5BAC1] uppercase">
                    PHONE NUMBER
                  </p>
                  <span>You haven&apos;t added a phone number yet</span>
                </div>
                <Button className="bg-[#4E5058] hover:bg-[#6D6F78] text-white h-8 rounded-none">
                  Edit
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
