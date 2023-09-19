import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";
import ServerMember from "./ServerMember";
import UserStatusPanel from "./UserStatusPanel";

interface ServerSideBarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerSideBar: React.FC<ServerSideBarProps> = async ({ serverId }) => {
  const { user } = await getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.TEXT;
  });

  const audioChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.AUDIO;
  });

  const videoChannels = server?.channels.filter((channel) => {
    return channel.type === ChannelType.VIDEO;
  });

  const members = server?.members.filter((member) => {
    return member.userId !== user.id;
  });

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => {
    return member.userId === user.id;
  })?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => {
                  return {
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  };
                }),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => {
                  return {
                    id: member.id,
                    name: member.user.name,
                    icon: roleIconMap[member.role],
                  };
                }),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-2">
              {textChannels.map((channel) => {
                return (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                );
              })}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-2">
              {audioChannels.map((channel) => {
                return (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                );
              })}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-2">
              {videoChannels.map((channel) => {
                return (
                  <ServerChannel
                    key={channel.id}
                    channel={channel}
                    server={server}
                    role={role}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div className="space-y-2">
          {!!members?.length && (
            <div className="mb-2">
              <ServerSection
                sectionType="members"
                role={role}
                label="Members"
                server={server}
              />
              {members.map((member) => {
                return <ServerMember key={member.id} member={member} server={server} />;
              })}
            </div>
          )}
        </div>
      </ScrollArea>
      <UserStatusPanel user={user}/>
    </div>
  );
};

export default ServerSideBar;
