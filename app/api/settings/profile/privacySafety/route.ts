import getCurrentUser from "@/actions/getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const userPrivacySafetySetting = await prismadb.userDetails.findFirst({
      where: {
        userId: user?.id,
      },
    });

    const desensitizatedPrivacyAndSafety = desensitizeDatabaseData(
      "UserDetails",
      [],
      userPrivacySafetySetting!
    );

    return NextResponse.json(desensitizatedPrivacyAndSafety);
  } catch (error) {
    console.log(error);
    console.log("[GET_PRIVACY_SAFETY_API FAILED]");
  }
}

export async function PATCH(request: Request) {
  try {
    const { user } = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await request.json();
    const { type, value } = body;

    type PrivacySettingType =
      | "explicitImage"
      | "dMSpam"
      | "directMessageFromServerMembers"
      | "accessToAgeRestrictedServerIOS"
      | "messageRequestFromUnknownServer"
      | "accessToAgeRestrictedCommandFromAppsInDirectMessage"
      | "allowUseDataImproveDiscord"
      | "allowUseDataCustomizeDiscord"
      | "InGameRewards";

    const typeToFieldMap: Record<PrivacySettingType, string> = {
      explicitImage: "explicitImageFilter",
      dMSpam: "dmSpamFilter",
      directMessageFromServerMembers: "directMessageFromServerMembers",
      accessToAgeRestrictedServerIOS: "accessToAgeRestrictedServerIOS",
      messageRequestFromUnknownServer: "messageRequestFromUnknownServer",
      accessToAgeRestrictedCommandFromAppsInDirectMessage:
        "accessToAgeRestrictedCommandFromAppsInDirectMessage",
      allowUseDataImproveDiscord: "allowUseDataImproveDiscord",
      allowUseDataCustomizeDiscord: "allowUseDataCustomizeDiscord",
      InGameRewards: "InGameRewards",
    };

    if (!typeToFieldMap[type as PrivacySettingType]) {
      return new NextResponse("Invalid type", { status: 400 });
    }

    let userPrivacySafetySetting = await prismadb.userDetails.update({
      where: {
        userId: user?.id,
      },
      data: {
        [typeToFieldMap[type as PrivacySettingType]]: value,
      },
    });

    const desensitizatedPrivacyAndSafety = desensitizeDatabaseData(
      "UserDetails",
      [],
      userPrivacySafetySetting!
    );

    return NextResponse.json(desensitizatedPrivacyAndSafety);
  } catch (error) {
    console.log(error);
    console.log("[PATCH_PRIVACY_SAFETY_API FAILED]");
  }
}
