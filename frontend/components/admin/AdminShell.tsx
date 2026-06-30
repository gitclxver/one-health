"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Loader2 } from "lucide-react";
import AdminHeader from "./AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, user } = useAuth();

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6aabaf]" />
      </div>
    );
  }

  if (state === "guest" || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center pt-20">
        <p className="text-slate-600 mb-4">Please sign in to access the admin area.</p>
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="px-6 py-3 rounded-full bg-slate-700 text-white text-sm font-semibold"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader />
      <div className="pt-28 md:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}
