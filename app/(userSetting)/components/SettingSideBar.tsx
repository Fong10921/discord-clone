import { Separator } from "@/components/ui/separator";
import SettingItem from "./SettingItem";

interface SettingSideBarProps {}

const SettingSideBar = () => {
  return (
    <div className="mt-12 flex flex-1 flex-col">
      <div className="text-[0.70rem] ml-2 font-bold tracking-wide text-zinc-400 transition my-2">
        USER SETTINGS
      </div>
      <SettingItem settingName="My Account" modalName="myAccount"/>
      <SettingItem settingName="Profiles" modalName="profile"/>
      <SettingItem settingName="Pricacy & Safety" modalName="privacyAndSafety"/>
      <SettingItem settingName="Family Center" modalName="familyCenter"/>
      <SettingItem settingName="Authorized App" modalName="authorizedApps"/>
      <SettingItem settingName="Devices" modalName="devices"/>
      <SettingItem settingName="Connections" modalName="connections"/>
      <SettingItem settingName="Friend Requests" modalName="friendRequests"/>
      <Separator className="bg-zinc-500 my-2 w-[90%]"/>
      <div className="text-[0.70rem] ml-2 font-bold tracking-wide text-zinc-400 transition my-2">
        BILLING SETTINGS
      </div>
      <SettingItem settingName="Nitro" modalName="nitro"/>
      <SettingItem settingName="Server Boost" modalName="serverBoost"/>
      <SettingItem settingName="Subscriptions" modalName="subscriptions"/>
      <SettingItem settingName="Gift Inventory" modalName="giftInventory"/>
      <SettingItem settingName="Billing" modalName="billing"/>
      <Separator className="bg-zinc-500 my-2 w-[90%]"/>
      <div className="text-[0.70rem] ml-2 font-bold tracking-wide text-zinc-400 transition my-2">
        APP SETTINGS
      </div>
      <SettingItem settingName="Appearance" modalName="appearance"/>
      <SettingItem settingName="Accessibility" modalName="accessibility"/>
      <SettingItem settingName="Voice & Video" modalName="voiceAndVideo"/>
      <SettingItem settingName="Text & Images" modalName="textAndImages"/>
      <SettingItem settingName="Notifications" modalName="notifications"/>
      <SettingItem settingName="Keybinds" modalName="keybinds"/>
      <SettingItem settingName="Language" modalName="language"/>
      <SettingItem settingName="Streamer Mode" modalName="streamerMode"/>
      <SettingItem settingName="Advanced" modalName="advanced"/>
      <Separator className="bg-zinc-500 my-2 w-[90%]"/>
      <div className="text-[0.70rem] ml-2 font-bold tracking-wide text-zinc-400 transition my-2">
        ACTIVITY SETTINGS
      </div>
      <SettingItem settingName="Activity Privacy" modalName="activityPrivacy"/>
      <Separator className="bg-zinc-500 my-2 w-[90%]"/>
      <SettingItem settingName="What's New" modalName="whatsNew"/>
      <SettingItem settingName="Merch" modalName="merch"/>
      <SettingItem settingName="HypeSquad" modalName="hypeSquad"/>
      <Separator className="bg-zinc-500 my-2 w-[90%]"/>
      <div className="py-[6px] rounded-lg pl-2 hover:cursor-pointer font-medium tracking-wide text-zinc-300 text-[1rem] w-[90%] hover:text-zinc-100 hover:bg-zinc-700/50">
        Log Out
      </div>
      <Separator className="bg-zinc-500 my-2 w-[90%]"/>
    
    </div>
  );
};

export default SettingSideBar;
