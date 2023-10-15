"use client";

import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { memo, useState } from "react";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onChange }) => {

  const { resolvedTheme } = useTheme();

  const [visible, setVisible] = useState(false);


  return (
    <Popover>
      <PopoverTrigger>
        <Smile onClick={() => setVisible(true)} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        {visible && <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => {
            onChange(emoji.native);
          }}
        />}
      </PopoverContent>
    </Popover>
  );
};

export default memo(EmojiPicker);
