"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  FileText,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type Post = Database["public"]["Tables"]["blog_posts"]["Row"];
type PostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

const emptyPost: Omit<PostInsert, "id"> = {
  title: "",
  slug: "",
  content: "",
  cover_image: null,
  tags: [],
  status: "draft",
  published_at: null,
};

/* ── Tiptap Toolbar ── */
function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  const buttons = [
    { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), class: "font-bold" },
    { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), class: "italic" },
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), class: "" },
    { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), class: "" },
    { label: "• List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), class: "" },
    { label: "1. List", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), class: "" },
    { label: "Code", action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock"), class: "font-mono" },
    { label: "Quote", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), class: "" },
    { label: "—", action: () => editor.chain().focus().setHorizontalRule().run(), active: false, class: "" },
  ];

  return (
    <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={btn.action}
          className={cn(
            "rounded px-2.5 py-1 text-xs transition-colors",
            btn.active
              ? "bg-accent-purple/20 text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-white",
            btn.class
          )}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

/* ── Rich Text Editor ── */
function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "محتوای مطلب را بنویسید...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="prose prose-invert max-w-none p-4 min-h-[200px] text-sm [&_.is-editor-empty]:text-gray-600">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/* ── Preview Modal ── */
function PreviewModal({
  post,
  onClose,
}: {
  post: { title: string; content: string; cover_image: string | null; tags: string[] };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#121218] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#121218] p-4">
          <h3 className="font-bold">پیش‌نمایش</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            بستن
          </button>
        </div>
        <div className="p-6">
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="mb-4 w-full rounded-lg object-cover"
            />
          )}
          <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-accent-purple/10 px-2 py-0.5 text-xs text-accent-purple"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyPost);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("خطا در بارگذاری مطالب");
      return;
    }
    setPosts(data || []);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyPost });
    setTagInput("");
    setModalOpen(true);
  }

  function openEdit(post: Post) {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      cover_image: post.cover_image,
      tags: [...post.tags],
      status: post.status,
      published_at: post.published_at,
    });
    setTagInput("");
    setModalOpen(true);
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  }

  function handleTitleChange(value: string) {
    const slug = generateSlug(value);
    setForm({ ...form, title: value, slug });
  }

  async function handleSave(statusOverride?: "draft" | "published") {
    if (!form.title.trim()) {
      toast.error("عنوان الزامی است");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      status: statusOverride || form.status,
      published_at:
        statusOverride === "published" && !form.published_at
          ? new Date().toISOString()
          : form.published_at,
    };

    try {
      if (editing) {
        const { error } = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("مطلب ویرایش شد");
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
        toast.success("مطلب اضافه شد");
      }
    } catch (err: any) {
      toast.error(err.message || "خطا در ذخیره");
      return;
    } finally {
      setSaving(false);
    }

    setModalOpen(false);
    fetchPosts();
  }

  async function handleDelete(post: Post) {
    if (!confirm(`آیا از حذف «${post.title}» مطمئنید؟`)) return;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", post.id);
    if (error) {
      toast.error("خطا در حذف");
      return;
    }
    toast.success("مطلب حذف شد");
    fetchPosts();
  }

  async function toggleStatus(post: Post) {
    const newStatus = post.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: newStatus,
        published_at:
          newStatus === "published" && !post.published_at
            ? new Date().toISOString()
            : post.published_at,
      })
      .eq("id", post.id);
    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }
    toast.success(
      newStatus === "published" ? "منتشر شد" : "به پیش‌نویس تغییر یافت"
    );
    fetchPosts();
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت بلاگ</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90"
        >
          <Plus className="h-4 w-4" />
          مطلب جدید
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-white/10 py-12 text-center text-gray-500">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-600" />
            هنوز مطلبی نوشته نشده
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-4">
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>/{post.slug}</span>
                    <span>
                      {new Date(post.created_at).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleStatus(post)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    post.status === "published"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-gray-500/15 text-gray-400"
                  )}
                >
                  {post.status === "published" ? "منتشرشده" : "پیش‌نویس"}
                </button>
                <button
                  onClick={() => {
                    setForm({
                      title: post.title,
                      slug: post.slug,
                      content: post.content,
                      cover_image: post.cover_image,
                      tags: post.tags,
                      status: post.status,
                      published_at: post.published_at,
                    });
                    setPreview(true);
                  }}
                  className="rounded p-1.5 text-gray-400 hover:text-accent-cyan transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="rounded p-1.5 text-gray-400 hover:text-accent-purple transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  className="rounded p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#121218] max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="mb-4 text-lg font-bold">
                {editing ? "ویرایش مطلب" : "مطلب جدید"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    عنوان *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    اسلاگ
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: e.target.value })
                    }
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-400 outline-none focus:border-accent-purple/50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    تصویر کاور
                  </label>
                  <input
                    type="url"
                    value={form.cover_image || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cover_image: e.target.value || null,
                      })
                    }
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    برچسب‌ها
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="تایپ و Enter بزنید"
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="rounded-lg border border-white/10 px-3 text-sm text-gray-400 hover:text-white"
                    >
                      افزودن
                    </button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {form.tags.map((t) => (
                        <span
                          key={t}
                          className="flex items-center gap-1 rounded bg-accent-purple/10 px-2 py-0.5 text-xs text-accent-purple"
                        >
                          {t}
                          <button
                            onClick={() => removeTag(t)}
                            className="ml-1 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-400">
                    محتوا
                  </label>
                  <RichTextEditor
                    content={form.content}
                    onChange={(html) => setForm({ ...form, content: html })}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">وضعیت:</span>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as "draft" | "published",
                      })
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  >
                    <option value="draft">پیش‌نویس</option>
                    <option value="published">منتشرشده</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 p-4">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50"
              >
                ذخیره پیش‌نویس
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "انتشار" : "انتشار مطلب"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <PreviewModal
          post={{
            title: form.title,
            content: form.content,
            cover_image: form.cover_image,
            tags: form.tags,
          }}
          onClose={() => setPreview(false)}
        />
      )}
    </div>
  );
}
