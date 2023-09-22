import { useEffect, useState } from "react";
import useConnectedUsersStore from "./use-user-status";

const useUserAvailabilityStatus = (userId: string) => {
    const connectedUsers = useConnectedUsersStore((state) => state.connectedUsers);
    const [isVisible, setIsVisible] = useState(true);
    const isOnline = userId ? connectedUsers.includes(userId) : false
    let status = "";

    useEffect(() => {
        if (typeof window === "undefined" || !window.document) {
            return;
        }
        setIsVisible(!document.hidden);

        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        }
    }, []) 

    if (isOnline && isVisible) {
        status = "Online";
    } else if (isOnline && !isVisible) {
        status = "Idle";
    } else {
        status = "Offline";
    }

    return status;
}

export default useUserAvailabilityStatus;
