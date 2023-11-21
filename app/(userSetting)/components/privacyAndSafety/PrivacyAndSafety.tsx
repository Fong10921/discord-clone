"use client";

import { useSettingPageModal } from "@/hooks/use-setting-page";
import ExplicitImageAndDMSpamRadio from "./ExplicitImageAndDMSpamRadio";
import PrivacyAndSafetySwitch from "./PrivacyAndSafetySwitch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const PrivacyAndSafety = () => {
  const { openType } = useSettingPageModal();

  if (openType !== "privacyAndSafety") {
    return null;
  }

  return (
    <div className="relative pl-10 pb-6 pt-[3.75rem] flex flex-1 max-h-[740px] min-w-[45rem] min-h-full ">
      <div className="w-full">
        <div className="mb-5 font-bold text-xl w-full">Privacy & Safety</div>
        <h3 className="small-text-1232asd text-xs leading-[0.5rem]">
          Direct Message Filter
        </h3>
        <h1
          className={`pb-2 text-base font-[550] leading-tight whitespace-nowrap cursor-pointer border-b-2 border-transparent mt-3`}
        >
          Explicit image filter
        </h1>
        <div className="leading-[1.25rem] text-[0.88rem] font-normal cursor-default text-[#B5BAC1] w-[100%]">
          Automatically block direct messages that might contain explicit
          images.{" "}
          <a href="" className="text-blue-500">
            Learn more about this setting here
          </a>
        </div>
        <ExplicitImageAndDMSpamRadio type="explicitImage" />
        <h1
          className={`pb-2 text-base font-[550] leading-tight whitespace-nowrap cursor-pointer border-b-2 border-transparent mt-7`}
        >
          DM Spam Filter
        </h1>
        <div className="leading-[1.25rem] text-[0.88rem] font-normal cursor-default text-[#B5BAC1] w-[100%]">
          Automatically send direct messages that might contain spam into a
          separate spam inbox.{" "}
          <a href="" className="text-blue-500">
            Learn more about this setting here
          </a>
        </div>
        <ExplicitImageAndDMSpamRadio type="dMSpam" />
        <div className="mt-9 flex flex-col">
          <h3 className="small-text-1232asd text-xs leading-[0.5rem] mb-3">
            Server Privacy Defaults
          </h3>
          <PrivacyAndSafetySwitch
            title="Allow direct messages from server members"
            description="This setting is applied when you join a new server. It does not
            apply retroactively to your existing servers."
            className="mt-4"
          />
          <Separator className="bg-[#4E5058] space-y-6 my-6" />
          <PrivacyAndSafetySwitch
            title="Allow access to age-restricted server on IOS"
            description="After joining on dekstop, view your servers for people 18+ on IOS devices."
          />
          <Separator className="bg-[#4E5058] space-y-6 my-6" />
          <PrivacyAndSafetySwitch
            title="Enable message requests from server members you may not know"
            description="If direct messages are enabled, this setting is applied when you join a new server. It does not apply retroactively to your existing servers."
            infoLinkDescription="Learn more about this setting here."
          />
          <Separator className="bg-[#4E5058] space-y-6 my-6" />
          <PrivacyAndSafetySwitch
            title="Allow access to age-restricted commands from apps in Direct Messages"
            description="This setting applies to all bots and apps. Allows people 18+ to access commands marked as age-restricted in DMs"
          />
          <Separator className="bg-[#4E5058] space-y-6 my-6" />
        </div>
        <div className="mt-9 flex flex-col">
          <h3 className="small-text-1232asd text-xs leading-[0.5rem] mb-3">
            How we use your data
          </h3>
          <PrivacyAndSafetySwitch
            title="Use data to improve Discord"
            description="This setting allows use to use and process information about how you navigate and use Discord for analytical purposes. For exmaple, it allows us to include you in new feature experiments we test."
            infoLinkDescription="Learn more about it here"
            className="mt-4"
          />
          <Separator className="bg-[#4E5058] space-y-6 my-6" />
          <PrivacyAndSafetySwitch
            title="Use data to customize my Discord experience"
            description="This setting allows use to use information, such as who you talk to and what games you plau=y, to customize Discord for you."
            infoLinkDescription="Learn more about it here"
          />
          <div className="pl-12 mt-4">
            <PrivacyAndSafetySwitch
              title="In-game rewards (aka Drops)"
              description="Use the information about what games you play to tell you about Drops opportunities and to complete Drops Quests."
            />
          </div>
          <Separator className="bg-[#4E5058] space-y-6 my-6" />
          <PrivacyAndSafetySwitch
            title="Use data to make Discord work"
            description="We need to store and process some data in order to provide you the basic Discord service, such as your messages, what server you're in and your Direct Messages. By using Discord, you allow us to provide this basic service, You can stop this by"
            infoLinkDescription="Disabling or Deleting your account."
          />
          <Separator className="bg-[#4E5058] space-y-6 my-6" />
          <h2 className="font-semibold text-base text-[#dadfe7]">
            Request all of my Data
          </h2>
          <p className="text-sm font-[550] mt-2 text-[#B5BAC1]">
            <a className="text-blue-500 cursor-pointer hover:underline">
              Learn More{" "}
            </a>
            about how getting a copy of your personal data works.
          </p>
          <Button
            variant="secondary_discord_blue"
            className="transition mt-5 text-sm py-0 tracking-wide px-4 text-white font-[590] h-8 rounded-none w-[20%]"
          >
            Request Data
          </Button>
          <div className="border-2 bg-transparent border-[black] flex justify-center items-center p-4 mt-6">
            <p className="text-sm font-[550] pl-6  text-[#B5BAC1]">
              Check out our{" "}
              <a className="text-blue-500 cursor-pointer hover:underline">
                Terms of Service
              </a>
              and
              <a className="text-blue-500 cursor-pointer hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyAndSafety;
