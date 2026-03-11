import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { LoginPayload } from "@/app/types/auth";
import { useToast } from "@/components/toast";

export function useLogin() {
   const queryClient = useQueryClient();
   const router = useRouter();
   const toast = useToast();

   return useMutation({
      mutationFn: (data: LoginPayload) =>
         apiFetch("/auth/sign-in", {
            method: "POST",
            body: JSON.stringify(data),
         }),

      onSuccess: () => {
         // 🔥 báo cho toàn app biết user đã login
         queryClient.invalidateQueries({ queryKey: ["me"] });

         // 🔁 chuyển trang
         router.push("/");
      },
      onError: (error: any) => {
         // ví dụ nếu apiFetch throw AppError
         toast.error(error.message ?? "Login failed");
      },
   });
}
