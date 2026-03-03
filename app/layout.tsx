import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { inter, playfair } from "./font";

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

          <main className="flex-1 max-w-5xl mx-auto w-full ">
            {children}
          </main>

          <Footer />
        </Providers>

      </body>
    </html>
  );
}
