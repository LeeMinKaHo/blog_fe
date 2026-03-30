import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { LoginPayload } from "@/app/types/auth";
import { useToast } from "@/components/toast";
import type { User } from "@/app/types/user";

export function useLogin() {
   const queryClient = useQueryClient();
   const router = useRouter();
   const toast = useToast();

   return useMutation({
      mutationFn: (data: LoginPayload) =>
         apiFetch<User>("/auth/sign-in", {
            method: "POST",
            body: JSON.stringify(data),
         }),

      onSuccess: (user: User) => {
         // ✅ Cập nhật cache "me" ngay lập tức với data trả về từ API login
         // Tránh flash màn hình chưa đăng nhập khi navigate
         queryClient.setQueryData(["me"], user);

         // 🔁 chuyển trang (lúc này cache đã có user → UI render đúng ngay)
         router.push("/");
      },
      onError: (error: any) => {
         toast.error(error.message ?? "Login failed");
      },
   });
}
