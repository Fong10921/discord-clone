import { useSettingPageModal } from "@/hooks/use-setting-page";

interface MyAccountProps {}

const MyAccount = () => {
  const { openType } = useSettingPageModal();

  if (openType !== "myAccount") {
    return;
  }

  return <div className="">My Account</div>;
};

export default MyAccount;
