import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./NavigationItem";
import { ModeToggle } from "../mode-toggle";
import UserProfileButton from "../UserProfileButton";

interface NavigationSidebarProps {
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = async ({

}) => {

  const { user } = await getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  const servers = await prismadb.server.findMany({
    where: {
      members: {
        some: {
          userId: user.id
        }
      }
    }
  })

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => {
          return (
            <div key={server.id}>
              <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
            </div>
          )
        })}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserProfileButton user={user} width={40} height={40} className="h-[48px] w-[48px]" />
      </div>
    </div>
  );
};

export default NavigationSidebar;