"use client";

import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import Image from "next/image";
import placeholderImage from "@/public/images/placeholder.png";
import useUserAvailabilityStatus from "@/hooks/use-visibility";

interface UserProfileButtonProps {
  user?: User;
  src?: string;
  onClick?: () => void;
  className?: string;
  showBadge?: boolean
  width?: number | `${number}` | undefined;
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
  const images = user?.image || src || placeholderImage;
  const altText = user?.name ? `${user.name} profile` : "User Profile";
  const status = useUserAvailabilityStatus(user?.id!);
  let statusColor = "bg-gray-500";

  if (status === "Online") {
    statusColor = "bg-green-500"

  } else if (status === "Idle") {
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
      {showBadge && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
            statusColor
          )}
        ></span>
      )}
    </div>
  );
};

export default UserProfileButton;
