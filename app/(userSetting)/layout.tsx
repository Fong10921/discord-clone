import { ScrollArea } from "@/components/ui/scroll-area";
import SettingSideBar from "./components/SettingSideBar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <div className="hidden-below-md md:flex w-[40rem] inset-y-0 inset-x-0 dark:bg-[#2B2D31] bg-[#F2F3F5] fixed">
        <ScrollArea className="w-full flex flex-row" thumbColor="bg-black">
          <div className="flex w-full">
            <div className="w-[30rem] block" />
            <SettingSideBar />
          </div>
        </ScrollArea>
      </div>
      <main className="md:pl-[42rem] h-full">
        {children}
      </main>
    </div >
  );
};

export default MainLayout;
