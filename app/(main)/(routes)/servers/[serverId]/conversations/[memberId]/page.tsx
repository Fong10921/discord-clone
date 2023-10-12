import getCurrentUser from "@/actions/getCurrentUser";
import { MediaRoom } from "@/components/MediaRoom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { getOrCreateConversation } from "@/lib/conversation";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage: React.FC<MemberIdPageProps> = async ({
  params,
  searchParams,
}) => {
  const { user } = await getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  const currentMember = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      userId: user.id,
    },
    include: {
      user: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.userId === user.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={params.serverId}
        imageUrl={otherMember.user.image ?? undefined}
        type="conversation"
        name={otherMember.user.name}
      />
      {searchParams.video && (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
          userName={user.name!}
        />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
            member={currentMember}
            name={otherMember.user.name!}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
          />
          <ChatInput
            name={otherMember.user.name!}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
