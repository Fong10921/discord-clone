"use client";

import UserProfileButton from "./UserProfileButton"
import { User } from "@prisma/client";
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button";

interface UserCardProps {
    user: User
}

const UserCard: React.FC<UserCardProps> = ({
    user
}) => {
    return (
        <div>
            <Card className="bg-black rounded-2xl w-full flex-row h-[30rem]">
                <div style={{ backgroundColor: 'rgb(105, 93, 93)' }} className="w-full block h-24 rounded-t-2xl" />
                <div className="flex justify-between flex-1">
                    <div className="flex items-center justify-center relative space-x-12">
                        <UserProfileButton className="pl-16 -mt-5" width={80} height={80} showBadge={true} />
                        <div className="pl-1 text-[1.25rem] font-bold">
                            {user?.name}
                        </div>
                    </div>
                    <Button className="mt-3 mr-3 text-sm py-0 px-4 bg-[#5865F2] text-white font-semibold h-8 rounded-none hover:bg-[#4752C4]">
                        Edit User Profile
                    </Button>
                </div>
                <CardContent>
                    <div className="mt-9 p-4 mr-3 ml-5 bg-[#2B2D31] flex flex-col space-x-2 rounded-xl">
                        <div className="flex flex-row justify-between">
                            <div>
                                <p className="text-xs font-bold tracking-wider">Display Name</p>
                                {user.name}
                            </div>
                            <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white h-8">
                                Edit
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserCard