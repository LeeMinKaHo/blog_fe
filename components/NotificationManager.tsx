"use client";

import { useNotification } from "@/app/hooks/useNotification";

export default function NotificationManager() {
    useNotification(); // Chỉ cần gọi để kích hoạt socket lắng nghe
    return null;
}
