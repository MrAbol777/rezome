"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message === "Invalid login credentials"
          ? "ایمیل یا رمز عبور اشتباه است"
          : error.message);
        return;
      }

      toast.success("ورود موفقیت‌آمیز بود");
      window.location.href = "/admin";
    } catch {
      toast.error("خطایی رخ داد. دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-purple/20">
            <Lock className="h-6 w-6 text-accent-purple" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">ورود به پنل مدیریت</h1>
          <p className="mt-2 text-sm text-gray-500">
            فقط ادمین مجاز به ورود است
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm text-gray-400">
              ایمیل
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-gray-400">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-purple px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent-purple/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ورود...
              </>
            ) : (
              "ورود"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
