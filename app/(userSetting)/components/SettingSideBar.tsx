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
    </div>
  );
};

export default SettingSideBar;
