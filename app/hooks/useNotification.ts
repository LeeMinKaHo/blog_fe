"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useMe } from "./useMe";
import { useToast } from "@/components/toast/ToastContext";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export function useNotification() {
    const { data: user } = useMe();
    const toast = useToast();
    const [socket, setSocket] = useState<Socket | null>(null);

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user?.id) return;

        const newSocket = io(SOCKET_URL, {
            query: { userId: user.id },
        });

        newSocket.on("connect", () => {
            console.log("Connected to notification socket");
        });

        newSocket.on("newNotification", (notification) => {
            console.log("New notification:", notification);
            toast.info(`${notification.sender?.name || "Ai đó"} ${notification.content}`);
            setUnreadCount((prev) => prev + 1);
        });


        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user?.id, toast]);


    return { socket, unreadCount, setUnreadCount };
}
