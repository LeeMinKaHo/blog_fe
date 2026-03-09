"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ToastProvider, ToastContainer } from "@/components/toast";
import NotificationManager from "@/components/NotificationManager";

export default function Providers({ children }: { children: ReactNode }) {
   const [queryClient] = useState(() => new QueryClient());

   return (
      <QueryClientProvider client={queryClient}>
         <ToastProvider>
            <NotificationManager />
            {children}
            <ToastContainer />
         </ToastProvider>
      </QueryClientProvider>
   );
}

