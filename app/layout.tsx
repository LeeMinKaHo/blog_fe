import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { inter, playfair } from "./font";
import VerificationBannerWrapper from "@/components/VerificationBannerWrapper";
import MainWrapper from "@/components/MainWrapper";

import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
   title: "Foxtek Blog - Developer Community",
   description: "A cutting-edge blog platform for developers, built with Next.js 16, React 19, and NestJS.",
   keywords: ["blog", "developer", "nextjs", "nestjs", "react", "programming"],
   authors: [{ name: "Foxtek" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
         <body className="bg-gray-50 min-h-screen flex flex-col">

            <Providers>
               <Header />
               <VerificationBannerWrapper />

               <MainWrapper>
                  {children}
               </MainWrapper>

               <Footer />
               <ScrollToTop />
            </Providers>

         </body>
      </html>
   );
}
