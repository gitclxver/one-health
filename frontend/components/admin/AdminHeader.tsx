"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  UserCircle,
  Users,
  Mail,
  ClipboardList,
  LogOut,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

type NavItem = { href: string; label: string; icon: LucideIcon; tab: string };
type NavGroup = {
  label: string;
  icon: LucideIcon;
  tab: string;
  href?: string;
  exact?: boolean;
  items?: NavItem[];
};

const NAV: NavGroup[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true, tab: "dashboard" },
  {
    label: "Content",
    icon: FileText,
    tab: "content",
    items: [
      { href: "/admin/articles", label: "Articles", icon: FileText, tab: "articles" },
      { href: "/admin/events", label: "Events", icon: Calendar, tab: "events" },
      { href: "/admin/exco", label: "Exco", icon: UserCircle, tab: "exco" },
    ],
  },
  {
    label: "People",
    icon: Users,
    tab: "people",
    items: [
      { href: "/admin/users", label: "Users", icon: Users, tab: "users" },
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail, tab: "subscribers" },
      { href: "/admin/applications", label: "Applications", icon: ClipboardList, tab: "applications" },
    ],
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}

function resolveActiveTab(pathname: string): string {
  if (pathname === "/admin") return "dashboard";
  if (pathname.startsWith("/admin/articles")) return "articles";
  if (pathname.startsWith("/admin/events")) return "events";
  if (pathname.startsWith("/admin/exco")) return "exco";
  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/subscribers")) return "subscribers";
  if (pathname.startsWith("/admin/applications")) return "applications";
  return "";
}

export default function AdminHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [blobStyle, setBlobStyle] = useState({ left: 0, width: 0, height: 0, top: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTab = resolveActiveTab(pathname);

  const updateBlob = (target: HTMLElement | null) => {
    if (!target || !navRef.current) return;
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
    const activeEl = navRef.current.querySelector(`[data-tab='${activeTab}']`) as HTMLElement;
    if (activeEl) updateBlob(activeEl);
    else setBlobStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  useEffect(() => {
    resetBlob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (mobileMenu) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  return (
    <header
      className="fixed top-3 md:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] md:w-[calc(100%-48px)] max-w-7xl z-50 transition-all duration-500"
      id="adminHeader"
    >
      <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-full px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between shadow-sm relative group/header hover:bg-white/60 hover:border-slate-200/50 hover:shadow-xl hover:shadow-slate-100/40 transition-all duration-500">
        <Link
          href="/admin"
          onClick={() => setMobileMenu(false)}
          className="flex items-center gap-2 md:gap-3 font-bold text-lg md:text-xl tracking-tight text-slate-800 group min-w-0 shrink-0"
        >
          <Image
            src="/logo.png"
            alt="One Health Logo"
            width={40}
            height={40}
            style={{ width: "auto", height: "auto" }}
            className="h-8 w-auto md:h-10 object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <span className="font-display truncate hidden sm:inline">
            ONE<span className="text-[#6aabaf] font-normal">/</span>HEALTH
          </span>
          <span className="text-[10px] font-bold text-[#6aabaf] uppercase tracking-wider bg-[#B3DEE2]/40 px-2 py-0.5 rounded-full hidden md:inline">
            Admin
          </span>
        </Link>

        <nav
          ref={navRef}
          className="hidden lg:flex items-center relative bg-[#CCD5AE]/20 p-1.5 rounded-full border border-[#CCD5AE]/40"
          onMouseLeave={() => {
            setHoveredTab(null);
            resetBlob();
          }}
        >
          <div
            className="absolute bg-white shadow-sm rounded-full transition-all duration-300 ease-out z-0 pointer-events-none"
            style={{
              left: `${blobStyle.left}px`,
              width: `${blobStyle.width}px`,
              height: `${blobStyle.height}px`,
              top: `${blobStyle.top}px`,
              opacity: blobStyle.opacity,
            }}
          />

          {NAV.map((group) => {
            if (group.href) {
              const Icon = group.icon;
              const active = isActive(pathname, group.href, group.exact);
              return (
                <Link
                  key={group.label}
                  href={group.href}
                  data-tab={group.tab}
                  onMouseEnter={(e) => {
                    setHoveredTab(group.tab);
                    updateBlob(e.currentTarget);
                  }}
                  className={`relative z-10 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                    hoveredTab === group.tab || (!hoveredTab && active)
                      ? "text-slate-800"
                      : "text-slate-600 hover:text-[#6aabaf]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {group.label}
                </Link>
              );
            }

            const Icon = group.icon;
            const groupIsActive = group.items?.some((item) => isActive(pathname, item.href));
            const open = openGroup === group.label;

            return (
              <div key={group.label} className="relative z-10" ref={open ? dropdownRef : undefined}>
                <button
                  type="button"
                  data-tab={groupIsActive ? group.items!.find((i) => isActive(pathname, i.href))?.tab : group.tab}
                  onMouseEnter={(e) => {
                    setHoveredTab(group.tab);
                    updateBlob(e.currentTarget);
                  }}
                  onClick={() => setOpenGroup(open ? null : group.label)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                    hoveredTab === group.tab || (!hoveredTab && groupIsActive)
                      ? "text-slate-800"
                      : "text-slate-600 hover:text-[#6aabaf]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {group.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                {open && group.items && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 min-w-[210px] bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-2xl shadow-2xl py-2 z-50">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const itemActive = isActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenGroup(null)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                            itemActive
                              ? "bg-[#B3DEE2]/30 text-slate-800"
                              : "text-slate-600 hover:bg-[#B3DEE2]/20"
                          }`}
                        >
                          <ItemIcon className="w-4 h-4 text-[#6aabaf]" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="hidden xl:flex items-center gap-1.5 px-4 h-11 rounded-full text-sm font-semibold text-slate-600 border border-slate-200/80 hover:bg-white/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex items-center gap-1.5 px-4 h-11 rounded-full text-sm font-semibold text-slate-700 border border-slate-200/80 hover:bg-white/80 transition-colors"
            title={user?.email ?? "Log out"}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Log out</span>
          </button>
        </div>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden text-slate-700 p-2.5 -mr-1 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenu && (
        <div className="absolute top-[4.25rem] left-0 w-full bg-white/95 backdrop-blur-2xl border border-slate-100 rounded-3xl p-4 shadow-2xl flex flex-col gap-1 md:hidden max-h-[calc(100dvh-5.5rem)] overflow-y-auto">
          <Link
            href="/admin"
            onClick={() => setMobileMenu(false)}
            className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {NAV.filter((g) => g.items).map((group) => (
            <div key={group.label} className="pt-2">
              <p className="px-4 py-1 text-xs font-bold text-[#6aabaf] uppercase tracking-wide">
                {group.label}
              </p>
              {group.items!.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base flex items-center gap-2"
                  >
                    <ItemIcon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="border-t border-slate-100 mt-2 pt-2 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenu(false)}
              className="px-4 py-3 rounded-xl hover:bg-[#B3DEE2]/30 font-semibold text-slate-700 text-base flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View site
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenu(false);
                void logout();
              }}
              className="w-full text-center bg-slate-700 text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
