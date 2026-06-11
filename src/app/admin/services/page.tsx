"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { Service, ServiceInsert } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Star,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const emptyService: ServiceInsert = {
  name: "",
  price: "",
  duration: "",
  description: "",
  features: [],
  revisions: "",
  is_popular: false,
  is_active: true,
  sort_order: 0,
  cta_text: "سفارش بده",
  cta_link: "/contact",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyService);
  const [featureInput, setFeatureInput] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      toast.error("خطا در بارگذاری خدمات");
      return;
    }
    setServices((data as Service[]) || []);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyService });
    setFeatureInput("");
    setModalOpen(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      name: s.name,
      price: s.price,
      duration: s.duration,
      description: s.description,
      features: [...s.features],
      revisions: s.revisions,
      is_popular: s.is_popular,
      is_active: s.is_active,
      sort_order: s.sort_order,
      cta_text: s.cta_text,
      cta_link: s.cta_link,
    });
    setFeatureInput("");
    setModalOpen(true);
  }

  function addFeature() {
    const f = featureInput.trim();
    if (f && !form.features.includes(f)) {
      setForm({ ...form, features: [...form.features, f] });
      setFeatureInput("");
    }
  }

  function removeFeature(f: string) {
    setForm({ ...form, features: form.features.filter((t) => t !== f) });
  }

  async function handleSave() {
    if (!form.name.trim() || !form.price.trim()) {
      toast.error("نام و قیمت الزامی است");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("services")
          .update(form as any)
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("خدمت ویرایش شد");
      } else {
        // If new is popular, unmark others
        if (form.is_popular) {
          await supabase
            .from("services")
            .update({ is_popular: false });
        }
        const { error } = await supabase.from("services").insert(form as any);
        if (error) throw error;
        toast.success("خدمت اضافه شد");
      }
    } catch (err: any) {
      toast.error(err.message || "خطا در ذخیره");
      return;
    } finally {
      setSaving(false);
    }

    setModalOpen(false);
    fetchServices();
  }

  async function handleDelete(s: Service) {
    if (!confirm(`آیا از حذف «${s.name}» مطمئنید؟`)) return;

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", s.id);
    if (error) {
      toast.error("خطا در حذف");
      return;
    }
    toast.success("خدمت حذف شد");
    fetchServices();
  }

  async function toggleActive(s: Service) {
    const { error } = await supabase
      .from("services")
      .update({ is_active: !s.is_active })
      .eq("id", s.id);
    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }
    fetchServices();
  }

  async function togglePopular(s: Service) {
    // If marking as popular, unmark others first
    if (!s.is_popular) {
      await supabase.from("services").update({ is_popular: false });
    }
    const { error } = await supabase
      .from("services")
      .update({ is_popular: !s.is_popular })
      .eq("id", s.id);
    if (error) {
      toast.error("خطا در تغییر وضعیت");
      return;
    }
    fetchServices();
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
        <h1 className="text-2xl font-bold">مدیریت خدمات</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90"
        >
          <Plus className="h-4 w-4" />
          خدمت جدید
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                نام
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                قیمت
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">
                مدت
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                بازبینی
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                محبوب
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                فعال
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-500">
                  هنوز خدمتی اضافه نشده
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr
                  key={s.id}
                  className={cn(
                    "border-b border-white/5 transition-colors hover:bg-white/[0.02]",
                    !s.is_active && "opacity-50"
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      {s.is_popular && (
                        <Star className="h-3.5 w-3.5 text-amber-400" />
                      )}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {s.description.slice(0, 50)}...
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{s.price}</td>
                  <td className="px-4 py-3 text-gray-400">{s.duration}</td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {s.revisions}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePopular(s)}
                      className="mx-auto"
                    >
                      <Star
                        className={cn(
                          "h-5 w-5 transition-colors",
                          s.is_popular
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-600 hover:text-gray-400"
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(s)}>
                      {s.is_active ? (
                        <ToggleRight className="h-6 w-6 text-green-400" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-600" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="rounded p-1 text-gray-400 hover:text-accent-purple transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s)}
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
              {editing ? "ویرایش خدمت" : "خدمت جدید"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    نام *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    قیمت *
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    مدت
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    بازبینی
                  </label>
                  <input
                    type="text"
                    value={form.revisions}
                    onChange={(e) =>
                      setForm({ ...form, revisions: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  توضیحات
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  ویژگی‌ها
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="تایپ و Enter بزنید"
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="rounded-lg border border-white/10 px-3 text-sm text-gray-400 hover:text-white"
                  >
                    افزودن
                  </button>
                </div>
                {form.features.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.features.map((f) => (
                      <span
                        key={f}
                        className="flex items-center gap-1 rounded bg-accent-purple/10 px-2 py-0.5 text-xs text-accent-purple"
                      >
                        {f}
                        <button
                          onClick={() => removeFeature(f)}
                          className="ml-1 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    متن دکمه
                  </label>
                  <input
                    type="text"
                    value={form.cta_text}
                    onChange={(e) =>
                      setForm({ ...form, cta_text: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    لینک دکمه
                  </label>
                  <input
                    type="text"
                    value={form.cta_link}
                    onChange={(e) =>
                      setForm({ ...form, cta_link: e.target.value })
                    }
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={form.is_popular}
                    onChange={(e) =>
                      setForm({ ...form, is_popular: e.target.checked })
                    }
                    className="accent-accent-purple"
                  />
                  محبوب‌ترین
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="accent-green-500"
                  />
                  فعال (نمایش در سایت)
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
                {editing ? "ذخیره تغییرات" : "افزودن خدمت"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
