import { create } from "zustand";

export type SettingPagesType = "myAccount" | "profile" | "privacyAndSafety" | "familyCenter" | "authorizedApps" | "devices" | "connections" | "friendRequests" | "nitro" | "serverBoost" | "subscriptions" | "giftInventory" | "billing" | "appearance" | "accessibility" | "voiceAndVideo" | "textAndImages" | "notifications" | "keybinds" | "language" | "streamerMode" | "advanced" | "activityPrivacy" | "whatsNew" | "merch" | "hypeSquad";

interface SettingStoreModal {
  openType: SettingPagesType | null;
  isOpen: (type: SettingPagesType) => boolean;
  onClose: () => void;
  onOpen: (type: SettingPagesType) => void;
}

export const useSettingPageModal = create<SettingStoreModal>((set) => ({
  openType: "myAccount",
  isOpen: function (type: SettingPagesType) {
    return this.openType === type;
  },
  onOpen: (type: SettingPagesType) => set({ openType: type }),
  onClose: () => set({ openType: null }),
}));
