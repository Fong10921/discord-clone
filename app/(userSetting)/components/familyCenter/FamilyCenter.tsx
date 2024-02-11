"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useSettingPageModal } from "@/hooks/use-setting-page";
import { useState } from "react";

const FamilyCenter = () => {
  const { openType } = useSettingPageModal();


  if (openType !== "familyCenter") {
    return;
  }


  return (
    <div>
      <Card>
        <CardContent>
          Stay informed about how your teen is using Discord
        </CardContent>
      </Card>
    </div>
  )
}

export default FamilyCenter