import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";

const useUserStatus = (userId: string | undefined) => {
    const [status, setStatus] = useState("Offline");
    const [isVisible, setIsVisible] = useState(true);
    const { connectedUsers } = useSocket();
    const isUserOnline = userId ? connectedUsers.includes(userId) : false;

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                setIsVisible(true);
            } else if (document.visibilityState === "hidden") {
                setIsVisible(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
    }, []);

    useEffect(() => {
        if (isVisible && isUserOnline) {
            setStatus("Online");
        } else if (!isVisible && isUserOnline) {
            setStatus("Idle");
        } else if (!isVisible && !isUserOnline) {
            setStatus("Offline");
        }
    }, [isVisible, isUserOnline]);

    return status;
}

export default useUserStatus;