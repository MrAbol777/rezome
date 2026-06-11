import { createClient } from "@/lib/supabase-server";
import { PricingCardSkeleton } from "@/components/skeleton";
import type { Service } from "@/types/database";

async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as Service[]) || [];
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-96 h-96 bg-purple-600 -top-48 -left-48" style={{ animationDelay: "-2s" }} />
      <div className="orb w-64 h-64 bg-cyan-500 top-1/3 right-0" style={{ animationDelay: "-4s" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-purple-400 mb-3">
            // خدمات و قیمت‌گذاری
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold">
            <span className="gradient-text">خدمات من</span>
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            بسته‌های مختلف توسعه وب متناسب با نیاز و بودجه شما.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.length === 0 ? (
            <>
              <PricingCardSkeleton />
              <PricingCardSkeleton />
              <PricingCardSkeleton />
            </>
          ) : (
            services.map((service, i) => (
              <div
                key={service.id}
                className={`relative glass-card rounded-3xl p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-2 ${
                  service.is_popular
                    ? "md:-mt-4 md:mb-0"
                    : ""
                }`}
                style={{
                  background: "var(--card)",
                  backdropFilter: "blur(16px) saturate(180%)",
                  WebkitBackdropFilter: "blur(16px) saturate(180%)",
                  borderColor: service.is_popular
                    ? "rgba(124, 58, 237, 0.4)"
                    : "var(--card-border)",
                }}
              >
                {/* Gradient border for popular */}
                {service.is_popular && (
                  <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-b from-purple-500 to-cyan-500 -z-10" />
                )}

                {/* Popular badge */}
                {service.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                      محبوب‌ترین
                    </span>
                  </div>
                )}

                {/* Name */}
                <h3 className="text-lg font-bold text-zinc-100 mb-1">
                  {service.name}
                </h3>

                {/* Price */}
                <p className="text-2xl font-bold gradient-text mb-1">
                  {service.price}
                </p>

                {/* Duration */}
                <p className="text-sm text-zinc-500 mb-4">
                  مدت: {service.duration}
                </p>

                {/* Description */}
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-zinc-300">
                      <svg
                        className="h-4 w-4 shrink-0 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Revisions */}
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6 border-t border-white/5 pt-4">
                  <svg
                    className="h-4 w-4 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {service.revisions} بازبینی
                </div>

                {/* CTA */}
                <a
                  href={service.cta_link}
                  className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold transition-all duration-300 shadow-lg"
                  style={{
                    background: service.is_popular
                      ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                      : "rgba(124, 58, 237, 0.15)",
                    color: service.is_popular ? "#fff" : "#a78bfa",
                    border: service.is_popular
                      ? "none"
                      : "1px solid rgba(124, 58, 237, 0.3)",
                    boxShadow: service.is_popular
                      ? "0 8px 32px rgba(124, 58, 237, 0.35)"
                      : "none",
                  }}
                >
                  {service.cta_text}
                </a>
              </div>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-zinc-400 text-sm">
            پروژه خاصی در ذهن دارید؟{" "}
            <a
              href="/contact"
              className="text-accent-purple hover:text-accent-cyan transition-colors underline underline-offset-4"
            >
              برای مشاوره رایگان تماس بگیرید
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
