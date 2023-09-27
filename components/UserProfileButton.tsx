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
  showBadge?: boolean;
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
    statusColor = "bg-green-500";
  } else if (status === "Idle") {
    statusColor = "bg-yellow-500";
  } else if (status === "Offline") {
    statusColor = "bg-gray-500";
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-full hover:cursor-pointer flex items-center justify-center",
        className,
        "w-12 h-12"
      )}
    >
      <Image
        src={images}
        width={width}
        height={height}
        alt={altText}
        className="rounded-full max-w-none"
      />
    {showBadge && (
        <span
            style={{
                position: 'absolute',
                bottom: '30%',  // Adjust this value to place it at the 3/4th of the circle
                left: '65%',  // Adjust to ensure it is half-outside the parent div
                transform: 'translateY(50%)',  // Adjusting translateY to shift badge downward
            }}
            className={cn(
                "w-4 h-4 rounded-full border-2 border-black",
                statusColor
            )}
        ></span>
    )}
    </div>
  );
};

export default UserProfileButton;
