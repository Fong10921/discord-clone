"use client";

import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import Image from "next/image";
import placeholderImage from "@/public/images/placeholder.png";
import useUserStatus from "@/hooks/use-page-visibility";

interface UserProfileButtonProps {
  user?: User;
  src?: string;
  onClick?: () => void;
  className?: string;
  showBadge?: boolean
  width? : number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({
  user,
  onClick,
  className,
  src,
  width,
  height,
  showBadge,
}) => {
  const status = useUserStatus(user?.id);
  const images = user?.image || src || placeholderImage;
  const altText = user?.name ? `${user.name} profile` : "User Profile";
  let statusColor = "";

  if (status === "Online") {
    statusColor = "bg-green-500"

  }  else if (status === "Idle") {
    statusColor = "bg-yellow-500"

  } else if (status === "Offline") {
    statusColor = "bg-gray-500"
  }

  return (
    <div onClick={onClick} className={cn("rounded-full w-12 h-12 hover:cursor-pointer flex items-center justify-center", className)}>
      <Image
        src={images}
        width={width}
        height={height}
        alt={altText}
        className="rounded-full"
      />
    </div>
  );
};

export default UserProfileButton;
