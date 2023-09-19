import { Hash, Menu } from "lucide-react";
import MobileToggle from "../MobileToggle";
import UserProfileButton from "../UserProfileButton";
import { SocketIndicator } from "../SocketIndicator";
import { ChatVideoButton } from "./ChatVideoButton";

interface ChatHeaderProps {
  serverId: string;
  name: string | null;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  serverId,
  name,
  type,
  imageUrl,
}) => {
  return (
    <div className="text-md flex font-semibold px-3 items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && <UserProfileButton width={40} height={40} src={imageUrl} className="mr-3" />}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && (
          <ChatVideoButton />
        )}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
