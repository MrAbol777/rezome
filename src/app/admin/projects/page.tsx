"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { Project, ProjectInsert } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ExternalLink,
  Code,
  Star,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

const emptyProject: ProjectInsert = {
  title: "",
  description: "",
  tags: [],
  github_url: null,
  live_url: null,
  image_url: null,
  featured: false,
  sort_order: 0,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyProject);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error("خطا در بارگذاری پروژه‌ها");
      return;
    }
    setProjects((data as Project[]) || []);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyProject });
    setTagInput("");
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      tags: [...project.tags],
      github_url: project.github_url,
      live_url: project.live_url,
      image_url: project.image_url,
      featured: project.featured,
      sort_order: project.sort_order,
    });
    setTagInput("");
    setImageFile(null);
    setImagePreview(project.image_url);
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

  async function handleImageUpload(file: File) {
    setUploadingImage(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("project-images")
      .upload(path, file, { contentType: file.type });

    if (error) {
      toast.error("خطا در آپلود تصویر: " + error.message);
      setUploadingImage(false);
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from("project-images")
      .getPublicUrl(data.path);

    setImagePreview(publicUrl.publicUrl);
    setForm({ ...form, image_url: publicUrl.publicUrl });
    setUploadingImage(false);
    toast.success("تصویر آپلود شد");
  }

  async function handleSave() {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("عنوان و توضیحات الزامی است");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("projects")
          .update(form as any)
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("پروژه ویرایش شد");
      } else {
        const { error } = await supabase.from("projects").insert(form as any);
        if (error) throw error;
        toast.success("پروژه اضافه شد");
      }
    } catch (err: any) {
      toast.error(err.message || "خطا در ذخیره");
      return;
    } finally {
      setSaving(false);
    }

    setModalOpen(false);
    fetchProjects();
  }

  async function handleDelete(project: Project) {
    if (!confirm(`آیا از حذف «${project.title}» مطمئنید؟`)) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);
    if (error) {
      toast.error("خطا در حذف");
      return;
    }
    toast.success("پروژه حذف شد");
    fetchProjects();
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
        <h1 className="text-2xl font-bold">مدیریت پروژه‌ها</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90"
        >
          <Plus className="h-4 w-4" />
          پروژه جدید
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                عنوان
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                برچسب‌ها
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                ویژه
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                ترتیب
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-500"
                >
                  هنوز پروژه‌ای اضافه نشده
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.title}</div>
                    <div className="truncate text-xs text-gray-500">
                      {p.description.slice(0, 60)}...
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded bg-accent-purple/10 px-1.5 py-0.5 text-xs text-accent-purple"
                        >
                          {t}
                        </span>
                      ))}
                      {p.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{p.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.featured && (
                      <Star className="mx-auto h-4 w-4 text-amber-400" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {p.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {p.live_url && (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded p-1 text-gray-400 hover:text-accent-cyan transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {p.github_url && (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded p-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Code className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded p-1 text-gray-400 hover:text-accent-purple transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="rounded p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121218] p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-bold">
              {editing ? "ویرایش پروژه" : "پروژه جدید"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  عنوان *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  توضیحات *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    لینک گیت‌هاب
                  </label>
                  <input
                    type="url"
                    value={form.github_url || ""}
                    onChange={(e) =>
                      setForm({ ...form, github_url: e.target.value || null })
                    }
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    لینک دمو
                  </label>
                  <input
                    type="url"
                    value={form.live_url || ""}
                    onChange={(e) =>
                      setForm({ ...form, live_url: e.target.value || null })
                    }
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  تصویر پروژه
                </label>

                {imagePreview ? (
                  <div className="relative rounded-lg border border-white/10 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-40 w-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setForm({ ...form, image_url: null });
                        setImageFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 left-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 py-8 cursor-pointer hover:border-accent-purple/30 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-8 w-8 animate-spin text-accent-purple" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-gray-600 mb-2" />
                        <span className="text-xs text-gray-500">
                          کلیک یا درگ تصویر
                        </span>
                      </>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="accent-accent-purple"
                  />
                  پروژه ویژه
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">ترتیب:</span>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sort_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "ذخیره تغییرات" : "افزودن پروژه"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
