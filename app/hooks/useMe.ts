// app/hooks/useMe.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";
import type { User } from "@/app/types/user";

export function useMe() {
   return useQuery<User | null>({
      queryKey: ["me"],
      queryFn: async () => {
         try {
            return await apiFetch<User>("/auth/me");
         } catch (err: any) {
            if (err.statusCode === 401 || err.statusCode === 404) {
               return null; // 👈 coi như chưa login
            }
            throw err; // lỗi khác thì vẫn throw
         }
      },
      retry: false,
   });
}
