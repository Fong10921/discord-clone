import { useSocket } from "@/providers/socket-provider";
import { Member, Message, User } from "@prisma/client";
import { useEffect } from "react";

const onlineUsers = {};

export const userOnlineStatus = () => {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) {
            return;
        };

        const handleUsername = (username) => {
            onlineUsers[socket.id] = username;
            socket.emit("userOnline", username);
        };

        const handleDisconnect = () => {
            const username = onlineUsers[socket.id];
            delete onlineUsers[socket.id];
            socket.emit("userOffline", username);
        };

        socket.on("username", handleUsername);
        socket.on("disconnect", handleDisconnect);
    });
}