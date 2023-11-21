import {
  BannerColor,
  Channel,
  ChannelType,
  Server,
  User,
} from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invitePeople"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage"
  | "editUsername"
  | "phoneNumber"
  | "email"
  | "bannerColor"
  | "changePassword"
  | "changeProfilePicture";

interface ModalData {
  user?: User;
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
  bannerColor?: BannerColor;
  utils?: any;
  key?: string; // Making key optional
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (type: ModalType, data?: ModalData, key?: string) => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}, key) => set({ isOpen: true, type, data }), // Key is optional
  onClose: () => set({ type: null, isOpen: false }),
}));
