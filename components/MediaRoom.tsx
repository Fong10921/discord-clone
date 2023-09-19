"use client";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
  userName: string;
}

export const MediaRoom = ({
  chatId,
  video,
  audio,
  userName,
}: MediaRoomProps) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!userName) {
      return;
    }

    (async () => {
      try {
        const response = await axios(
          `/api/livekit?room=${chatId}&username=${userName}`
        );
        const data = await response.data;
        setToken(data.token);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [chatId, userName]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="animate-spin h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      video={video}
      audio={audio}
      connect={true}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
