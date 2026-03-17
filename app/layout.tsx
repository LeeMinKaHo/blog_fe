import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { inter, playfair } from "./font";
import VerificationBannerWrapper from "@/components/VerificationBannerWrapper";
import MainWrapper from "@/components/MainWrapper";

import ScrollToTop from "@/components/ScrollToTop";

export const metadata = {
   title: "My Blog",
   description: "A clean blog built with Next.js",
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
