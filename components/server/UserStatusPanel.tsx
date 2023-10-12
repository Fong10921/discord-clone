"use client";

import { User } from "@prisma/client";
import UserProfileButton from "../UserProfileButton";
import useUserAvailabilityStatus from "@/hooks/use-visibility";
import ActionToolTip from "../ActionToolTip";
import { useState } from "react";
import Link from "next/dist/client/link";
import {
  settingSVG,
  microphoneSVG,
  strikethroughHeadphoneSVG,
  strikethroughMicrophoneSVG,
  headphoneSVG,
} from "../SVG";

interface UserStatusPanelProps {
  user: User;
}

const UserStatusPanel: React.FC<UserStatusPanelProps> = ({ user }) => {
  const status = useUserAvailabilityStatus(user?.id!);
  const [mute, setMute] = useState(false);
  const [deafen, setDeafen] = useState(false);

  const microphoneLabel = mute ? "Unmute" : "Mute";
  const headphoneLabel = deafen ? "Undeafen" : "Deafen";

  const handleIconState = (icon: "microphone" | "headphone") => {
    if (icon === "microphone") {
      setMute((prevMute) => !prevMute);
    } else {
      setDeafen((prevDeafen) => !prevDeafen);
    }
  };

  const truncateUsername = (username: string | null) => {
    if (username && username.length > 10) {
      const truncated = username.slice(0, 10);
      return `${truncated}...`;
    }
    return username;
  }

  return (
    <div className="dark:bg-zinc-800 flex flex-row items-center">
      <div className="my-2 m-1 pr-2 flex hover:bg-zinc-700 hover:border hover:border-[bg-zinc-800] flex-1">
        <UserProfileButton
          user={user}
          showBadge={true}
          width={32}
          height={32}
          className="p-0"
        />
        <div className="mt-2">
          <p
            className="text-[0.8rem] text-semibold"
          >
            {truncateUsername(user?.name)}
          </p>
          <p className="text-[0.750rem] font-extralight">{status}</p>
        </div>
      </div>
      <div className="flex space-x-1 flex-1">
        <ActionToolTip side="top" align="center" label={microphoneLabel}>
          <div
            onClick={() => handleIconState("microphone")}
            className="hover:bg-zinc-700 transition p-1 hover:cursor-pointer"
          >
            {mute ? strikethroughMicrophoneSVG : microphoneSVG}
          </div>
        </ActionToolTip>
        <ActionToolTip side="top" label={headphoneLabel}>
          <div
            onClick={() => handleIconState("headphone")}
            className="hover:bg-zinc-700 transition p-1 hover:cursor-pointer"
          >
            {deafen ? strikethroughHeadphoneSVG : headphoneSVG}
          </div>
        </ActionToolTip>
        <ActionToolTip side="top" label="User Settings">
          <Link
            className="hover:bg-zinc-700 transition p-1 hover:cursor-pointer"
            href="/settings"
            replace
          >
            {settingSVG}
          </Link>
        </ActionToolTip>
      </div>
    </div>
  );
};

export default UserStatusPanel;
