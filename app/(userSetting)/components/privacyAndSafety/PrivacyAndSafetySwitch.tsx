"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface PrivacyAndSafetySwitchProps {
  title: string;
  description?: string;
  className?: string;
  infoLink?: string;
  infoLinkDescription?: string;
}

const PrivacyAndSafetySwitch: React.FC<PrivacyAndSafetySwitchProps> = ({
  title,
  description,
  className,
  infoLink,
  infoLinkDescription,
}) => {
  return (
    <>
      <div className={cn(`flex flex-row justify-between`, className)}>
        <h2 className="font-semibold text-base text-[#dadfe7]">{title}</h2>
        <Switch className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300" />
      </div>
      <p className="text-sm font-[550] mt-2 text-[#B5BAC1]">
        {description}{" "}
        <a href={infoLink} className="text-blue-500 cursor-pointer hover:underline">
          {infoLinkDescription}
        </a>
      </p>
    </>
  );
};

export default PrivacyAndSafetySwitch;
