import getCurrentUser from "@/actions/getCurrentUser";
import { MediaRoom } from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import prismadb from "@/lib/prismadb";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage: React.FC<ChannelIdPageProps> = async ({ params }) => {
  const { user } = await getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  const channel = await prismadb.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: user.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            chatId={channel.id}
            paramValue={channel.id}
            member={member}
            name={channel.name}
            paramKey="channelId"
            type="channel"
            apiUrl="/api/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            socketUrl="/api/socket/messages"
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom userName={user.name!} chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom userName={user.name!} chatId={channel.id} video={true} audio={false} />
      )}
    </div>
  );
};

export default ChannelIdPage;
