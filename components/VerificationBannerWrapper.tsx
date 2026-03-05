"use client";

import { useMe } from "@/app/hooks/useMe";
import VerificationBanner from "./VerificationBanner";

/**
 * Wrapper client component để đặt VerificationBanner vào layout (Server Component).
 * Tự động hiển thị banner khi user đã đăng nhập nhưng chưa xác thực email.
 */
export default function VerificationBannerWrapper() {
    const { data: user } = useMe();

    // Chỉ hiện khi: đã đăng nhập + chưa verify
    if (!user || user.isVerified !== false) return null;

    return <VerificationBanner email={user.email} />;
}
