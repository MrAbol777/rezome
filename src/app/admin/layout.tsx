import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import "@/app/globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "پنل مدیریت — رزومه",
  description: "پنل مدیریت وب‌سایت رزومه",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body
        className={`${vazirmatn.variable} font-vazirmatn bg-[#0a0a0f] text-gray-200 antialiased`}
        suppressHydrationWarning
      >
        <AdminSidebar />
        <div className="min-h-screen md:mr-64">
          <div className="p-4 md:p-6">{children}</div>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-vazirmatn)",
              background: "#18181b",
              color: "#e4e4e7",
              border: "1px solid rgba(255,255,255,0.08)",
              direction: "rtl",
            },
          }}
        />
      </body>
    </html>
  );
}
