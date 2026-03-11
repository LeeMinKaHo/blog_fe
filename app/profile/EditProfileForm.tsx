"use client";

import { useState } from "react";
import { useToast } from "@/components/toast";

type Props = {
  name?: string;
};

export default function EditProfileForm({ name }: Props) {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(name ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: value }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      setIsEditing(false);
      toast.success("Cập nhật profile thành công!");
      window.location.reload(); // 🔥 đơn giản – đúng intern level
    } catch (err) {
      toast.error("Cập nhật profile thất bại!");
    } finally {
      setLoading(false);
    }
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        Edit profile
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Your name"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          onClick={() => {
            setIsEditing(false);
            setValue(name ?? "");
          }}
          className="rounded-lg border px-4 py-1.5 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
