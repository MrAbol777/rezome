"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Wrench,
  Mail,
  BarChart3,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  Package,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "داشبورد" },
  { href: "/admin/projects", icon: FolderGit2, label: "پروژه‌ها" },
  { href: "/admin/services", icon: Package, label: "خدمات" },
  { href: "/admin/blog", icon: FileText, label: "بلاگ" },
  { href: "/admin/skills", icon: Wrench, label: "مهارت‌ها" },
  { href: "/admin/messages", icon: Mail, label: "پیام‌ها" },
  { href: "/admin/analytics", icon: BarChart3, label: "آمار" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        {!collapsed && (
          <Link href="/" className="text-lg font-bold gradient-text">
            رزومه — پنل
          </Link>
        )}
        <div className="flex items-center gap-1">
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
          {/* Desktop collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors md:block"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-accent-purple/15 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 right-0 w-full border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>خروج</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 right-3 z-50 rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white md:hidden"
      >
        {mobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 z-40 h-screen w-64 border-l border-white/10 bg-[#0a0a0f] transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 hidden h-screen border-l border-white/10 bg-[#0a0a0f] transition-all duration-300 md:block",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
