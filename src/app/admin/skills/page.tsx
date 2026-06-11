"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Wrench,
  Briefcase,
  Star,
} from "lucide-react";

type Skill = Database["public"]["Tables"]["skills"]["Row"];
type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];
type Experience = Database["public"]["Tables"]["experiences"]["Row"];
type ExperienceInsert = Database["public"]["Tables"]["experiences"]["Insert"];

const emptySkill: Omit<SkillInsert, "id"> = {
  name: "",
  category: "",
  level: 3,
  icon: null,
  sort_order: 0,
};

const emptyExperience: Omit<ExperienceInsert, "id"> = {
  company: "",
  role: "",
  start_date: new Date().toISOString().split("T")[0],
  end_date: null,
  description: "",
  is_current: false,
  sort_order: 0,
};

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState<"skills" | "experiences">(
    "skills"
  );

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillModal, setSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState(emptySkill);

  // Experience state
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [expModal, setExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState(emptyExperience);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const [{ data: skillsData }, { data: expData }] = await Promise.all([
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);
    setSkills(skillsData || []);
    setExperiences(expData || []);
    setLoading(false);
  }

  /* ── Skills CRUD ── */
  function openAddSkill() {
    setEditingSkill(null);
    setSkillForm({ ...emptySkill });
    setSkillModal(true);
  }

  function openEditSkill(s: Skill) {
    setEditingSkill(s);
    setSkillForm({
      name: s.name,
      category: s.category,
      level: s.level,
      icon: s.icon,
      sort_order: s.sort_order,
    });
    setSkillModal(true);
  }

  async function saveSkill() {
    if (!skillForm.name.trim() || !skillForm.category.trim()) {
      toast.error("نام و دسته‌بندی الزامی است");
      return;
    }
    setSaving(true);
    try {
      if (editingSkill) {
        const { error } = await supabase
          .from("skills")
          .update(skillForm)
          .eq("id", editingSkill.id);
        if (error) throw error;
        toast.success("مهارت ویرایش شد");
      } else {
        const { error } = await supabase.from("skills").insert(skillForm);
        if (error) throw error;
        toast.success("مهارت اضافه شد");
      }
    } catch (err: any) {
      toast.error(err.message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
    setSkillModal(false);
    fetchAll();
  }

  async function deleteSkill(s: Skill) {
    if (!confirm(`آیا از حذف «${s.name}» مطمئنید؟`)) return;
    const { error } = await supabase.from("skills").delete().eq("id", s.id);
    if (error) {
      toast.error("خطا در حذف");
      return;
    }
    toast.success("مهارت حذف شد");
    fetchAll();
  }

  /* ── Experience CRUD ── */
  function openAddExp() {
    setEditingExp(null);
    setExpForm({ ...emptyExperience });
    setExpModal(true);
  }

  function openEditExp(e: Experience) {
    setEditingExp(e);
    setExpForm({
      company: e.company,
      role: e.role,
      start_date: e.start_date,
      end_date: e.end_date,
      description: e.description,
      is_current: e.is_current,
      sort_order: e.sort_order,
    });
    setExpModal(true);
  }

  async function saveExp() {
    if (!expForm.company.trim() || !expForm.role.trim()) {
      toast.error("شرکت و سمت الزامی است");
      return;
    }
    setSaving(true);
    try {
      if (editingExp) {
        const { error } = await supabase
          .from("experiences")
          .update(expForm)
          .eq("id", editingExp.id);
        if (error) throw error;
        toast.success("سابقه ویرایش شد");
      } else {
        const { error } = await supabase.from("experiences").insert(expForm);
        if (error) throw error;
        toast.success("سابقه اضافه شد");
      }
    } catch (err: any) {
      toast.error(err.message || "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
    setExpModal(false);
    fetchAll();
  }

  async function deleteExp(e: Experience) {
    if (!confirm(`آیا از حذف «${e.company}» مطمئنید؟`)) return;
    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", e.id);
    if (error) {
      toast.error("خطا در حذف");
      return;
    }
    toast.success("سابقه حذف شد");
    fetchAll();
  }

  function renderLevel(level: number) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i <= level ? "fill-amber-400 text-amber-400" : "text-gray-600"
            )}
          />
        ))}
      </div>
    );
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
      <h1 className="mb-6 text-2xl font-bold">مهارت‌ها و سوابق</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("skills")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-2 text-sm transition-colors",
            activeTab === "skills"
              ? "border-accent-purple text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          )}
        >
          <Wrench className="h-4 w-4" />
          مهارت‌ها
        </button>
        <button
          onClick={() => setActiveTab("experiences")}
          className={cn(
            "flex items-center gap-2 border-b-2 px-4 py-2 text-sm transition-colors",
            activeTab === "experiences"
              ? "border-accent-purple text-white"
              : "border-transparent text-gray-500 hover:text-gray-300"
          )}
        >
          <Briefcase className="h-4 w-4" />
          سوابق شغلی
        </button>
      </div>

      {/* ── Skills Tab ── */}
      {activeTab === "skills" && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={openAddSkill}
              className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90"
            >
              <Plus className="h-4 w-4" />
              مهارت جدید
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {skills.length === 0 ? (
              <p className="col-span-full py-12 text-center text-gray-500">
                هنوز مهارتی اضافه نشده
              </p>
            ) : (
              skills.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {s.icon && <span className="text-lg">{s.icon}</span>}
                      <h3 className="font-medium">{s.name}</h3>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                      <span className="rounded bg-white/5 px-1.5 py-0.5">
                        {s.category}
                      </span>
                      {renderLevel(s.level)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditSkill(s)}
                      className="rounded p-1.5 text-gray-400 hover:text-accent-purple transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSkill(s)}
                      className="rounded p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Experiences Tab ── */}
      {activeTab === "experiences" && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={openAddExp}
              className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90"
            >
              <Plus className="h-4 w-4" />
              سابقه جدید
            </button>
          </div>

          <div className="space-y-3">
            {experiences.length === 0 ? (
              <div className="rounded-xl border border-white/10 py-12 text-center text-gray-500">
                هنوز سابقه‌ای اضافه نشده
              </div>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{exp.role}</h3>
                        {exp.is_current && (
                          <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs text-green-400">
                            فعلی
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-accent-cyan">
                        {exp.company}
                      </p>
                      <p className="mt-2 text-sm text-gray-400">
                        {exp.description}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(exp.start_date).toLocaleDateString("fa-IR")}
                        {" — "}
                        {exp.is_current
                          ? "اکنون"
                          : exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString("fa-IR")
                          : "—"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditExp(exp)}
                        className="rounded p-1.5 text-gray-400 hover:text-accent-purple transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteExp(exp)}
                        className="rounded p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Skill Modal ── */}
      {skillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121218] p-6">
            <h2 className="mb-4 text-lg font-bold">
              {editingSkill ? "ویرایش مهارت" : "مهارت جدید"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  نام *
                </label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  دسته‌بندی *
                </label>
                <select
                  value={skillForm.category}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                >
                  <option value="">انتخاب...</option>
                  <option value="frontend">فرانت‌اند</option>
                  <option value="backend">بک‌اند</option>
                  <option value="devops">دواپس</option>
                  <option value="design">طراحی</option>
                  <option value="tools">ابزارها</option>
                  <option value="other">سایر</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  سطح (۱-۵)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => setSkillForm({ ...skillForm, level: i })}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors",
                        i <= skillForm.level
                          ? "border-accent-purple/50 bg-accent-purple/20 text-white"
                          : "border-white/10 text-gray-500"
                      )}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  آیکون (emoji)
                </label>
                <input
                  type="text"
                  value={skillForm.icon || ""}
                  onChange={(e) =>
                    setSkillForm({
                      ...skillForm,
                      icon: e.target.value || null,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSkillModal(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={saveSkill}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Experience Modal ── */}
      {expModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#121218] p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-bold">
              {editingExp ? "ویرایش سابقه" : "سابقه جدید"}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    شرکت *
                  </label>
                  <input
                    type="text"
                    value={expForm.company}
                    onChange={(e) =>
                      setExpForm({ ...expForm, company: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    سمت *
                  </label>
                  <input
                    type="text"
                    value={expForm.role}
                    onChange={(e) =>
                      setExpForm({ ...expForm, role: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    تاریخ شروع
                  </label>
                  <input
                    type="date"
                    value={expForm.start_date}
                    onChange={(e) =>
                      setExpForm({ ...expForm, start_date: e.target.value })
                    }
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    تاریخ پایان
                  </label>
                  <input
                    type="date"
                    value={expForm.end_date || ""}
                    disabled={expForm.is_current}
                    onChange={(e) =>
                      setExpForm({
                        ...expForm,
                        end_date: e.target.value || null,
                      })
                    }
                    dir="ltr"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none disabled:opacity-50 focus:border-accent-purple/50"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={expForm.is_current}
                  onChange={(e) =>
                    setExpForm({
                      ...expForm,
                      is_current: e.target.checked,
                      end_date: e.target.checked ? null : expForm.end_date,
                    })
                  }
                  className="accent-accent-purple"
                />
                شغل فعلی
              </label>
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  توضیحات
                </label>
                <textarea
                  value={expForm.description}
                  onChange={(e) =>
                    setExpForm({ ...expForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple/50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setExpModal(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={saveExp}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple/90 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
