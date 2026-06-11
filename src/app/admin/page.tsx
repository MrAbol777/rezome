import type { ContactMessage, Project, BlogPost } from "@/types/database";
import { createClient } from "@/lib/supabase-server";
import { FolderGit2, FileText, Mail, TrendingUp } from "lucide-react";

async function getStats() {
  const supabase = await createClient();

  const [
    { count: projectsCount },
    { count: postsCount },
    { count: messagesCount },
    { count: viewsCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase.from("page_views").select("*", { count: "exact", head: true }),
  ]);

  // Recent activity: last 5 from each table
  const [recentMessages, recentProjects, recentPosts] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("projects")
      .select("title, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("blog_posts")
      .select("title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const activity: { text: string; time: string; type: string }[] = [];

  ((recentMessages.data as ContactMessage[]) || []).forEach((m) =>
    activity.push({
      text: `پیام جدید از ${m.name}`,
      time: new Date(m.created_at).toLocaleDateString("fa-IR"),
      type: "message",
    })
  );
  ((recentProjects.data as Project[]) || []).forEach((p) =>
    activity.push({
      text: `پروژه جدید: ${p.title}`,
      time: new Date(p.created_at).toLocaleDateString("fa-IR"),
      type: "project",
    })
  );
  ((recentPosts.data as BlogPost[]) || []).forEach((p) =>
    activity.push({
      text: `مطلب ${p.status === "published" ? "منتشرشده" : "پیش‌نویس"}: ${p.title}`,
      time: new Date(p.created_at).toLocaleDateString("fa-IR"),
      type: "post",
    })
  );

  activity.sort(
    (a, b) =>
      new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return {
    projects: projectsCount || 0,
    posts: postsCount || 0,
    unreadMessages: messagesCount || 0,
    totalViews: viewsCount || 0,
    activity: activity.slice(0, 5),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: "پروژه‌ها",
      value: stats.projects,
      icon: FolderGit2,
      color: "text-accent-purple",
      bg: "bg-accent-purple/10",
    },
    {
      label: "مطالب بلاگ",
      value: stats.posts,
      icon: FileText,
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10",
    },
    {
      label: "پیام‌های خوانده‌نشده",
      value: stats.unreadMessages,
      icon: Mail,
      color: stats.unreadMessages > 0 ? "text-amber-400" : "text-gray-400",
      bg: stats.unreadMessages > 0 ? "bg-amber-400/10" : "bg-gray-400/10",
    },
    {
      label: "بازدید کل",
      value: stats.totalViews,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">داشبورد</h1>

      {/* Stat Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-bold">{value}</p>
              </div>
              <div className={`rounded-lg p-3 ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold">فعالیت‌های اخیر</h2>
        {stats.activity.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            هنوز فعالیتی ثبت نشده
          </p>
        ) : (
          <ul className="space-y-3">
            {stats.activity.map((item, i) => (
              <li
                key={i}
                className="flex items-start justify-between border-b border-white/5 py-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-accent-purple mt-1.5" />
                  <span className="text-sm">{item.text}</span>
                </div>
                <span className="shrink-0 text-xs text-gray-500">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
