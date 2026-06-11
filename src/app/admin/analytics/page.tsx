"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Loader2, TrendingUp, Users, Globe } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface DayData {
  date: string;
  views: number;
}

interface PageData {
  path: string;
  views: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [todayViews, setTodayViews] = useState(0);
  const [uniquePages, setUniquePages] = useState(0);
  const [chartData, setChartData] = useState<DayData[]>([]);
  const [topPages, setTopPages] = useState<PageData[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const today = new Date(now.toDateString());

    // Total views
    const { count: totalCount } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true });

    // Today views
    const { count: todayCount } = await supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .gte("viewed_at", today.toISOString());

    // Unique pages
    const { data: pagesData } = await supabase
      .from("page_views")
      .select("path")
      .neq("path", "");

    // Last 30 days data
    const { data: viewsData } = await supabase
      .from("page_views")
      .select("path, viewed_at")
      .gte("viewed_at", thirtyDaysAgo.toISOString())
      .order("viewed_at", { ascending: true });

    setTotalViews(totalCount || 0);
    setTodayViews(todayCount || 0);
    setUniquePages(
      new Set(pagesData?.map((p) => p.path) || []).size
    );

    // Aggregate by day
    if (viewsData) {
      const dayMap = new Map<string, number>();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dayMap.set(d.toISOString().split("T")[0], 0);
      }

      viewsData.forEach((v) => {
        const day = new Date(v.viewed_at).toISOString().split("T")[0];
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      });

      setChartData(
        Array.from(dayMap.entries()).map(([date, views]) => ({
          date: new Date(date).toLocaleDateString("fa-IR", {
            month: "short",
            day: "numeric",
          }),
          views,
        }))
      );
    }

    // Top pages
    if (pagesData) {
      const pathCount = new Map<string, number>();
      pagesData.forEach((p) => {
        pathCount.set(p.path, (pathCount.get(p.path) || 0) + 1);
      });

      setTopPages(
        Array.from(pathCount.entries())
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10)
      );
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">آمار بازدید</h1>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-purple/10 p-3">
              <Users className="h-5 w-5 text-accent-purple" />
            </div>
            <div>
              <p className="text-sm text-gray-500">بازدید کل</p>
              <p className="text-2xl font-bold">{totalViews}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-cyan/10 p-3">
              <TrendingUp className="h-5 w-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm text-gray-500">بازدید امروز</p>
              <p className="text-2xl font-bold">{todayViews}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-400/10 p-3">
              <Globe className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">صفحات متفاوت</p>
              <p className="text-2xl font-bold">{uniquePages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-4 text-lg font-semibold">بازدید ۳۰ روز اخیر</h2>
        {chartData.every((d) => d.views === 0) ? (
          <p className="py-8 text-center text-gray-500">
            هنوز بازدیدی ثبت نشده
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="#52525b"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    fontFamily: "var(--font-vazirmatn)",
                    direction: "rtl",
                  }}
                  labelStyle={{ color: "#a1a1aa" }}
                  itemStyle={{ color: "#7c3aed" }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: "#7c3aed" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Pages */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-4 text-lg font-semibold">صفحات پربازدید</h2>
        {topPages.length === 0 ? (
          <p className="py-8 text-center text-gray-500">داده‌ای موجود نیست</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPages}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="path"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    fontFamily: "var(--font-vazirmatn)",
                    direction: "rtl",
                  }}
                  labelStyle={{ color: "#a1a1aa" }}
                  itemStyle={{ color: "#06b6d4" }}
                />
                <Bar
                  dataKey="views"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
