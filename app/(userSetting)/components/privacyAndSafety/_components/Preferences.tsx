import { Separator } from "@/components/ui/separator";
import PrivacyAndSafetySwitch from "../PrivacyAndSafetySwitch";
import ExplicitImageAndDMSpamRadio from "../ExplicitImageAndDMSpamRadio";
import { Button } from "@/components/ui/button";
import { DesensitizatizedUserDetails } from "@/constants/types/types";

interface PreferencesProps {
  privacySafety: DesensitizatizedUserDetails
}

const Preferences: React.FC<PreferencesProps> = ({
  privacySafety
}) => {
  return (
    <>
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
        Automatically block direct messages that might contain explicit images.{" "}
        <a href="" className="text-[#00A8FC]">
          Learn more about this setting here
        </a>
      </div>
      <ExplicitImageAndDMSpamRadio type="explicitImage" data={privacySafety} />
      <h1
        className={`pb-2 text-base font-[550] leading-tight whitespace-nowrap cursor-pointer border-b-2 border-transparent mt-7`}
      >
        DM Spam Filter
      </h1>
      <div className="leading-[1.25rem] text-[0.88rem] font-normal cursor-default text-[#B5BAC1] w-[100%]">
        Automatically send direct messages that might contain spam into a
        separate spam inbox.{" "}
        <a href="" className="text-[#00A8FC]">
          Learn more about this setting here
        </a>
      </div>
      <ExplicitImageAndDMSpamRadio type="dMSpam" data={privacySafety} />
      <div className="mt-9 flex flex-col">
        <h3 className="small-text-1232asd text-xs leading-[0.5rem] mb-3">
          Server Privacy Defaults
        </h3>
        <PrivacyAndSafetySwitch
          title="Allow direct messages from server members"
          description="This setting is applied when you join a new server. It does not
            apply retroactively to your existing servers."
          className="mt-4"
          data={privacySafety.directMessageFromServerMembers}
          type="directMessageFromServerMembers"
        />
        <Separator className="bg-[#4E5058] space-y-6 my-6" />
        <PrivacyAndSafetySwitch
          title="Allow access to age-restricted server on IOS"
          description="After joining on dekstop, view your servers for people 18+ on IOS devices."
          data={privacySafety.accessToAgeRestrictedServerIOS}
          type="accessToAgeRestrictedServerIOS"
        />
        <Separator className="bg-[#4E5058] space-y-6 my-6" />
        <PrivacyAndSafetySwitch
          title="Enable message requests from server members you may not know"
          description="If direct messages are enabled, this setting is applied when you join a new server. It does not apply retroactively to your existing servers."
          infoLinkDescription="Learn more about this setting here."
          data={privacySafety.messageRequestFromUnknownServer}
          type="messageRequestFromUnknownServer"
        />
        <Separator className="bg-[#4E5058] space-y-6 my-6" />
        <PrivacyAndSafetySwitch
          title="Allow access to age-restricted commands from apps in Direct Messages"
          description="This setting applies to all bots and apps. Allows people 18+ to access commands marked as age-restricted in DMs"
          data={
            privacySafety.accessToAgeRestrictedCommandFromAppsInDirectMessage
          }
          type="accessToAgeRestrictedCommandFromAppsInDirectMessage"
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
          data={privacySafety.allowUseDataImproveDiscord}
          type="allowUseDataImproveDiscord"
        />
        <Separator className="bg-[#4E5058] space-y-6 my-6" />
        <PrivacyAndSafetySwitch
          title="Use data to customize my Discord experience"
          description="This setting allows use to use information, such as who you talk to and what games you plau=y, to customize Discord for you."
          infoLinkDescription="Learn more about it here"
          data={privacySafety.allowUseDataCustomizeDiscord}
          type="allowUseDataCustomizeDiscord"
        />
        <div className="pl-12 mt-4">
          <PrivacyAndSafetySwitch
            title="In-game rewards (aka Drops)"
            description="Use the information about what games you play to tell you about Drops opportunities and to complete Drops Quests."
            data={privacySafety.InGameRewards}
            type="InGameRewards"
          />
        </div>
        <Separator className="bg-[#4E5058] space-y-6 my-6" />
        <PrivacyAndSafetySwitch
          title="Use data to make Discord work"
          description="We need to store and process some data in order to provide you the basic Discord service, such as your messages, what server you're in and your Direct Messages. By using Discord, you allow us to provide this basic service, You can stop this by"
          infoLinkDescription="Disabling or Deleting your account."
          disableSwitch={true}
        />
        <Separator className="bg-[#4E5058] space-y-6 my-6" />
        <h2 className="font-semibold text-base text-[#dadfe7]">
          Request all of my Data
        </h2>
        <p className="text-sm font-[550] mt-2 text-[#B5BAC1]">
          <a className="text-[#00A8FC] cursor-pointer hover:underline">
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
        <div className="border-2 bg-transparent border-[black] flex items-center p-4 mt-6 mb-9">
          <p className="text-sm font-[550] pl-6 text-[#B5BAC1]">
            Check out our{" "}
            <a className="text-[#00A8FC] cursor-pointer hover:underline">
              Terms of Service{" "}
            </a>
            and{" "}
            <a className="text-[#00A8FC] cursor-pointer hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Preferences;
