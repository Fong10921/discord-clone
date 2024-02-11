"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, CigaretteIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { DesensitizationServer } from "@/constants/types/types";
import Image from "next/image";

interface ChooseServerforServerProfile {
  userServerList: DesensitizationServer[];
  setChoosenServer: Dispatch<SetStateAction<DesensitizationServer>>;
  choosenServer: DesensitizationServer;
}

const ChooseServerforServerProfile: React.FC<ChooseServerforServerProfile> = ({
  userServerList,
  setChoosenServer,
  choosenServer,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(choosenServer ? choosenServer : userServerList[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant={"outline"}
          role="combobox"
          type="button"
          aria-expanded={open}
          className="w-full justify-between p-0 pl-3"
        >
          <div className="flex flex-row items-center justify-center">
            <Image
              src={value.imageUrl}
              alt={value.name}
              width={25}
              height={25}
            />
            <div className="ml-3 text-base text-[#fafaf9]">{value?.name}</div>
          </div>
          <CigaretteIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[42.5rem] p-0">
        <Command className="w-full">
          <CommandInput
            placeholder="Search Server..."
            className="h-9 w-full"
          />
          <CommandEmpty>No server found.</CommandEmpty>
          <CommandGroup>
            {userServerList.map((server) => (
              <CommandItem
                className="pt-3 pb-3 flex items-center justify-between"
                key={server.imageUrl}
                onSelect={() => {
                  setValue(server);
                  setOpen(false);
                  setChoosenServer(server);
                }}
              >
                <Image
                  src={server.imageUrl}
                  alt={server.name}
                  width={25}
                  height={25}
                />
                <div className="ml-3 mt-0 text-base text-[#fafaf9] ">
                  {server.name}
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value.imageUrl === server.imageUrl
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ChooseServerforServerProfile;
