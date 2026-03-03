"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../lib/api";
import { AuthGuard } from "@/components/AuthGuard";
import ProfileCard from "@/components/Profile/ProfileCard";

export default function ProfilePage() {
   const { data: user, isLoading } = useQuery({
      queryKey: ["profile"],
      queryFn: () => getProfile(),
   });

   if (isLoading) {
      return (
         <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-4">
               <div className="h-48 bg-gray-200 rounded-3xl"></div>
               <div className="h-8 bg-gray-200 rounded w-1/3"></div>
               <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
         </div>
      );
   }

   if (!user) {
      return null;
   }

   return (
      <AuthGuard>
         <div className="max-w-4xl mx-auto px-4 py-12">
            <ProfileCard user={user} />
         </div>
      </AuthGuard>
   );
}
