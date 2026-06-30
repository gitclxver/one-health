import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/lib/auth/auth-context";
import SiteChrome from "@/components/layout/SiteChrome";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "One Health Student Society",
  description: "A Student Society for Environmental Inquiry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`scroll-smooth antialiased ${plusJakartaSans.variable}`}>
      <body className="bg-[#f7f9f4] text-slate-700 overflow-x-hidden selection:bg-[#B3DEE2] selection:text-slate-800">
        <AuthProvider>
          <SiteChrome>{children}</SiteChrome>
          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: "font-sans text-sm",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
