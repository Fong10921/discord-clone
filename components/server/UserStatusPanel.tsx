"use client";

import { User } from "@prisma/client";
import UserProfileButton from "../UserProfileButton";

interface UserStatusPanelProps {
    user: User,
}

const UserStatusPanel: React.FC<UserStatusPanelProps> = ({
    user
}) => {
    return (
        <div className="dark:bg-zinc-800 flex flex-row items-center">
            <div className="ml-2">
                <UserProfileButton user={user} showBadge={true} width={36} height={36} />
                <p>{user.name}</p>
            </div>
        </div>
    )
}

export default UserStatusPanel;