import { ScrollArea } from "@/components/ui/scroll-area";
import SettingSideBar from "./components/SettingSideBar";
import ESCButton from "./components/EscButton";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden-below-md md:flex h-full w-[35%] z-30 inset-y-0 dark:bg-[#2B2D31] bg-[#F2F3F5] fixed">
        <ScrollArea className="w-full flex flex-row" thumbColor="bg-black">
          <div className="flex w-full">
            <div className="w-[70%] block" />
            <SettingSideBar />
          </div>
        </ScrollArea>
      </div>
      <main className="md:pl-[35%] h-full">
        {children}
      </main>
      <ESCButton />
    </div >
  );
};

export default MainLayout;
