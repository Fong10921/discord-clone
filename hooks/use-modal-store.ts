import { Channel, ChannelType, Server, User } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "invitePeople" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage" | "editUsername" | "phoneNumber" | "email";

interface ModalData {
  user?: User;
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onClose: () => void;
  onOpen: (type: ModalType, data?: ModalData) => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({isOpen: true, type, data}),
  onClose: () => set({ type: null, isOpen: false }),
}))