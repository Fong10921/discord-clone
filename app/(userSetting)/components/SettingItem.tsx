"use client";

import { SettingPagesType, useSettingPageModal } from "@/hooks/use-setting-page";

interface SettingItemProps {
  settingName: string,
  modalName: SettingPagesType,
}

const SettingItem: React.FC<SettingItemProps> = ({
  settingName,
  modalName
}) => {

  const { onOpen, openType, onClose } = useSettingPageModal();

  const handleClick = () => {
    if (openType === modalName) {
      return;
    } else if (openType !== modalName) {
      onClose();
      onOpen(modalName);
    }
    onOpen(modalName)
  }

  return (
    <div onClick={handleClick} className="py-[6px] rounded-lg pl-2 mb-1 hover:cursor-pointer font-extrabold tracking-wide text-zinc-300 text-[1rem] w-[90%] hover:text-zinc-100 hover:bg-zinc-700/50">
      {settingName}
    </div>
  );
};

export default SettingItem;