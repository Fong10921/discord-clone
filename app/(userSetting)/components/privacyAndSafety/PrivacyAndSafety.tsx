"use client";

import { useSettingPageModal } from "@/hooks/use-setting-page";
import { useQuery } from "@tanstack/react-query";
import { fetchUserPrivacySafetySetting } from "@/utils/apiGetRequest";
import { DesensitizatizedUserDetails } from "@/constants/types/types";
import { useState } from "react";
import Preferences from "./_components/Preferences";

interface privacyAndSafetyProps {
  initialUserPrivacySafety: DesensitizatizedUserDetails;
}

const PrivacyAndSafety: React.FC<privacyAndSafetyProps> = ({
  initialUserPrivacySafety,
}) => {
  const { openType } = useSettingPageModal();
  const [privacyType, setPrivacyType] = useState("preferences");

  const { data: privacySafety } = useQuery<DesensitizatizedUserDetails>({
    queryKey: ["userPrivacySafety"],
    queryFn: fetchUserPrivacySafetySetting,
    initialData: initialUserPrivacySafety,
  });

  const handleProfileTypeChange = (privacyString: string) => {
    if (privacyString === privacyType) {
      return;
    } else {
      setPrivacyType(privacyString);
    }
  };

  if (openType !== "privacyAndSafety") {
    return null;
  }

  return (
    <div className="relative pl-10 pb-6 pt-[3.75rem] flex flex-1 max-h-[740px] min-w-[45rem] min-h-full ">
      <div className="w-full">
        {privacyType === "preferences" && <Preferences privacySafety={privacySafety} />}
      </div>
    </div>
  );
};

export default PrivacyAndSafety;
