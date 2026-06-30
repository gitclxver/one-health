"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, PlusCircle, LayoutDashboard, Home } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";

const ADMIN_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"]);

export default function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();
  const { state, user } = useAuth();
  const showAdminLink = state === "authenticated" && user && ADMIN_ROLES.has(user.role);

  // For the animated blob
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [blobStyle, setBlobStyle] = useState({ left: 0, width: 0, height: 0, top: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);

  const activeTab: string = pathname === "/" ? "home" 
                  : pathname.startsWith("/about") ? "about" 
                  : pathname.startsWith("/events") ? "events" 
                  : pathname.startsWith("/articles") ? "articles" 
                  : "";

  const updateBlob = (target: HTMLElement | null) => {
    if (!target) return;
    setBlobStyle({
      left: target.offsetLeft,
      width: target.offsetWidth,
      height: target.offsetHeight,
      top: target.offsetTop,
      opacity: 1,
    });
  };

  const resetBlob = () => {
    if (!navRef.current) return;
    // Find the active link
    const activeEl = navRef.current.querySelector(`[data-tab='${activeTab}']`) as HTMLElement;
    if (activeEl) {
      updateBlob(activeEl);
    } else {
      setBlobStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    resetBlob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  return (
    <header
      className="fixed top-3 md:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] md:w-[calc(100%-48px)] max-w-7xl z-50 transition-all duration-500"
      id="mainHeader"
    >
      <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between shadow-sm relative group/header hover:bg-white/60 hover:border-slate-200/50 hover:shadow-xl hover:shadow-slate-100/40 transition-all duration-500">
        <Link
          href="/"
          onClick={() => setMobileMenu(false)}
          className="flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl tracking-tight text-slate-800 group min-w-0"
        >
          <Image
            src="/logo.png"
            alt="One Health Logo"
            width={40}
            height={40}
            style={{ width: "auto", height: "auto" }}
            className="h-8 w-auto md:h-10 object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <span className="font-display truncate">
            ONE<span className="text-[#6aabaf] font-normal">/</span>HEALTH
          </span>
        </Link>

        <nav
          ref={navRef}
          className="hidden md:flex items-center relative bg-[#CCD5AE]/20 p-1.5 rounded-full border border-[#CCD5AE]/40"
          onMouseLeave={() => {
            setHoveredTab(null);
            resetBlob();
          }}
        >
          {/* Animated background blob */}
          <div
            className="absolute bg-white shadow-sm rounded-full transition-all duration-300 ease-out z-0 pointer-events-none"
            style={{
              left: `${blobStyle.left}px`,
              width: `${blobStyle.width}px`,
              height: `${blobStyle.height}px`,
              top: `${blobStyle.top}px`,
              opacity: blobStyle.opacity,
            }}
          ></div>

          <Link
            href="/"
            data-tab="home"
            onMouseEnter={(e) => {
              setHoveredTab("home");
              updateBlob(e.currentTarget);
            }}
            className={`relative z-10 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-1.5 ${
              hoveredTab === "home" || (!hoveredTab && activeTab === "home")
                ? "text-slate-800"
                : "text-slate-600 hover:text-[#6aabaf]"
            }`}
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </Link>

          <Link
            href="/about"
            data-tab="about"
            onMouseEnter={(e) => {
              setHoveredTab("about");
              updateBlob(e.currentTarget);
            }}
            className={`relative z-10 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
              hoveredTab === "about" || (!hoveredTab && activeTab === "about")
                ? "text-slate-800"
                : "text-slate-600 hover:text-[#6aabaf]"
            }`}
          >
            About
          </Link>

          <Link
            href="/#exco"
            data-tab="leadership"
            onMouseEnter={(e) => {
              setHoveredTab("leadership");
              updateBlob(e.currentTarget);
            }}
            className={`relative z-10 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
              hoveredTab === "leadership" || (!hoveredTab && activeTab === "leadership")
                ? "text-slate-800"
                : "text-slate-600 hover:text-[#6aabaf]"
            }`}
          >
            Leadership
          </Link>

          <Link
            href="/events"
            data-tab="events"
            onMouseEnter={(e) => {
              setHoveredTab("events");
              updateBlob(e.currentTarget);
            }}
            className={`relative z-10 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
              hoveredTab === "events" || (!hoveredTab && activeTab === "events")
                ? "text-slate-800"
                : "text-slate-600 hover:text-[#6aabaf]"
            }`}
          >
            Events
          </Link>

          <Link
            href="/articles"
            data-tab="articles"
            onMouseEnter={(e) => {
              setHoveredTab("articles");
              updateBlob(e.currentTarget);
            }}
            className={`relative z-10 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
              hoveredTab === "articles" || (!hoveredTab && activeTab === "articles")
                ? "text-slate-800"
                : "text-slate-600 hover:text-[#6aabaf]"
            }`}
          >
            Articles
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {showAdminLink && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 h-12 rounded-full text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-white/80 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          )}
          <Link
            href="/#join"
            className="btn-liquid bg-slate-700 text-white px-7 h-12 flex items-center justify-center rounded-full text-sm font-semibold shadow-md shadow-slate-700/15 transition-colors duration-300"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Join Society
            </span>
          </Link>
        </div>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-slate-700 p-2.5 -mr-1 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="absolute top-[4.25rem] left-0 w-full bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-3xl p-4 shadow-2xl flex flex-col gap-2 md:hidden max-h-[calc(100dvh-5.5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenu(false)}
            className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            HOME
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenu(false)}
            className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base"
          >
            About
          </Link>
          <Link
            href="/#exco"
            onClick={() => setMobileMenu(false)}
            className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base"
          >
            Leadership
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenu(false)}
            className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base"
          >
            Events
          </Link>
          <Link
            href="/articles"
            onClick={() => setMobileMenu(false)}
            className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base"
          >
            Articles
          </Link>
          {showAdminLink && (
            <Link
              href="/admin"
              onClick={() => setMobileMenu(false)}
              className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base"
            >
              Admin
            </Link>
          )}
          <Link
            href="/#join"
            onClick={() => setMobileMenu(false)}
            className="w-full text-center bg-slate-700 text-white py-3.5 rounded-xl font-semibold text-sm mt-2"
          >
            Join Society
          </Link>
        </div>
      )}
    </header>
  );
}
