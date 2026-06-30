"use client";

import { usePathname } from "next/navigation";
import AmbientBackdrop from "@/components/layout/AmbientBackdrop";
import ProgressTimeline from "@/components/layout/ProgressTimeline";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <AmbientBackdrop />
        <main className="relative z-10">{children}</main>
      </>
    );
  }

  return (
    <>
      <AmbientBackdrop />
      <ProgressTimeline />
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
