"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";
import { Trash2, Loader2, Mail, MailOpen, Eye, X } from "lucide-react";

type Message = Database["public"]["Tables"]["contact_messages"]["Row"];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("خطا در بارگذاری پیام‌ها");
      return;
    }
    setMessages(data || []);
    setLoading(false);
  }

  async function toggleRead(msg: Message) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: !msg.is_read })
      .eq("id", msg.id);
    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }
    fetchMessages();
  }

  async function deleteMessage(msg: Message) {
    if (!confirm(`آیا از حذف پیام ${msg.name} مطمئنید؟`)) return;
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", msg.id);
    if (error) {
      toast.error("خطا در حذف");
      return;
    }
    toast.success("پیام حذف شد");
    if (selected?.id === msg.id) setSelected(null);
    fetchMessages();
  }

  async function markAllRead() {
    const unread = messages.filter((m) => !m.is_read);
    if (unread.length === 0) return;

    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .in(
        "id",
        unread.map((m) => m.id)
      );
    if (error) {
      toast.error("خطا در علامت‌گذاری");
      return;
    }
    toast.success("همه پیام‌ها خوانده شدند");
    fetchMessages();
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">پیام‌های تماس</h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-amber-400">
              {unreadCount} پیام خوانده‌نشده
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <MailOpen className="h-4 w-4" />
            خواندن همه
          </button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-white/10 py-12 text-center text-gray-500">
          <Mail className="mx-auto mb-3 h-10 w-10 text-gray-600" />
          هنوز پیامی دریافت نشده
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-center justify-between rounded-xl border p-4 transition-colors cursor-pointer",
                msg.is_read
                  ? "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                  : "border-accent-purple/20 bg-accent-purple/5 hover:bg-accent-purple/10"
              )}
              onClick={() => setSelected(msg)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                    msg.is_read
                      ? "bg-gray-800 text-gray-500"
                      : "bg-accent-purple/20 text-accent-purple"
                  )}
                >
                  {msg.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{msg.name}</span>
                    {!msg.is_read && (
                      <span className="h-2 w-2 rounded-full bg-accent-purple" />
                    )}
                  </div>
                  <span
                    className="truncate text-xs text-gray-500"
                    dir="ltr"
                  >
                    {msg.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleDateString("fa-IR")}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(msg);
                    }}
                    className="rounded p-1.5 text-gray-400 hover:text-accent-cyan transition-colors"
                  >
                    {msg.is_read ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <MailOpen className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(msg);
                    }}
                    className="rounded p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#121218] p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{selected.name}</h2>
                <p className="text-sm text-gray-500" dir="ltr">
                  {selected.email}
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {new Date(selected.created_at).toLocaleString("fa-IR")}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded p-1.5 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm leading-7">
              {selected.message}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              {!selected.is_read && (
                <button
                  onClick={() => {
                    toggleRead(selected);
                    setSelected({ ...selected, is_read: true });
                  }}
                  className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                  علامت به عنوان خوانده‌شده
                </button>
              )}
              <button
                onClick={() => deleteMessage(selected)}
                className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
