import { ScrollArea } from "@/components/ui/scroll-area";
import SettingSideBar from "./components/SettingSideBar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden-below-md md:flex h-full w-[35%] z-30 inset-y-0 bg-zinc-800 fixed">
        <div className="w-[65%] block" />
        <ScrollArea className="flex-1 w-full">
          <SettingSideBar />
        </ScrollArea>
      </div>
      <main className="md:pl-[40%] h-full pt-[3rem]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
