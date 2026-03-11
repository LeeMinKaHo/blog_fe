import { useToast } from "./ToastContext";

/**
 * 🚀 High-level toast actions for better reusability and consistency.
 * Use this hook instead of raw toast.success/error for common app events.
 */
export function useToastActions() {
    const toast = useToast();

    return {
        ...toast,

        /** Default API error handler */
        apiError: (err: any, customTitle?: string) => {
            const message = err?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau.";
            return toast.error(customTitle || message);
        },

        auth: {
            loginSuccess: () => toast.success("Chào mừng bạn quay trở lại! 👋"),
            loginFail: (msg?: string) => toast.error(msg || "Đăng nhập thất bại. Kiểm tra lại thông tin nhé!"),
            logoutSuccess: () => toast.info("Đã đăng xuất. Hẹn gặp lại bạn!"),
            registerSuccess: () => toast.success("Đăng ký tài khoản thành công! 🎉"),
            verifySuccess: () => toast.success("Xác thực tài khoản thành công! ✅"),
        },

        blog: {
            createSuccess: () => toast.success("Bài viết đã được đăng thành công! 📝"),
            updateSuccess: () => toast.success("Đã cập nhật bài viết! ✨"),
            deleteSuccess: () => toast.success("Đã xoá bài viết."),
            saveDraft: () => toast.info("Đã lưu bản nháp."),
        },

        user: {
            updateProfileSuccess: () => toast.success("Cập nhật thông tin thành công! 👤"),
            updateAvatarSuccess: () => toast.success("Đã đổi ảnh đại diện mới! 📸"),
        },

        file: {
            uploadSuccess: () => toast.success("Tải tệp lên thành công!"),
            uploadFail: () => toast.error("Tải tệp lên thất bại. Vui lòng thử lại."),
            tooLarge: () => toast.warning("Kích thước tệp quá lớn! Tối đa 10MB."),
        }
    };
}
