"use server";
import { api } from "@/app/lib/api";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  return await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
