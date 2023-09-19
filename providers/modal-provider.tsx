"use client";

import CreateChannelModal from "@/components/models/CreateChannelModal";
import CreateServerModal from "@/components/models/CreateServerModal";
import DeleteChannelModal from "@/components/models/DeleteChannelModal";
import DeleteMessageModal from "@/components/models/DeleteMessageModal";
import DeleteServerModal from "@/components/models/DeleteServerModal";
import EditChannelModal from "@/components/models/EditChannelModal";
import EditServerModal from "@/components/models/EditServerModal";
import InvitePeopleModal from "@/components/models/InvitePeopleModal";
import LeaveServerModal from "@/components/models/LeaveServerModal";
import MembersModal from "@/components/models/MembersModal";
import MessageFileModal from "@/components/models/MessageFileModal";
import { useEffect, useState } from "react";

const ModalProvider = () => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])

  if (!isMounted) {
    return;
  }

  return (
    <>
      <CreateServerModal />
      <CreateChannelModal />
      <EditServerModal />
      <EditChannelModal />
      <MembersModal />
      <InvitePeopleModal />
      <MessageFileModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <DeleteMessageModal />
    </>
  );
};

export default ModalProvider;