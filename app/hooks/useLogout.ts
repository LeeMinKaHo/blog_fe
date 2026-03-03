import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/app/lib/api";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch("/auth/logout", {
        method: "POST",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
