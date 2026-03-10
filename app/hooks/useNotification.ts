"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useMe } from "./useMe";
import { useToast } from "@/components/toast/ToastContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnreadCount } from "../services/notificationService";


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export function useNotification() {
    const { data: user } = useMe();
    const toast = useToast();
    const queryClient = useQueryClient();
    const [socket, setSocket] = useState<Socket | null>(null);

    const { data: unreadData } = useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: getUnreadCount,
        enabled: !!user?.id,
    });


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
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        });



        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user?.id, toast]);


    return { socket, unreadCount: unreadData?.count || 0 };
}

