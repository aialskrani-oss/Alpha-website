import { useRef } from "react";
import { useListSections, useGetSettings, useListNews, useListPlatforms, useListAdvertisements, useGetStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Bot, Brain, GraduationCap, Dumbbell, Cpu, Film, Folder,
  ExternalLink, Calendar, Pin, ChevronLeft, Star, Globe, Monitor, Wrench,
  BarChart3, Users
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  bot: Bot, brain: Brain, "graduation-cap": GraduationCap, dumbbell: Dumbbell, cpu: Cpu, film: Film, folder: Folder,
};

const TYPE_ICON: Record<string, React.ElementType> = {
  telegram_bot: Bot, website: Globe, program: Monitor, tool: Wrench,
};

const TYPE_LABEL_AR: Record<string, string> = {
  telegram_bot: "بوت تلغرام", website: "موقع", program: "برنامج", tool: "أداة",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

function MesopotamianDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
      {label ? (
        <span className="font-cinzel text-primary text-sm tracking-widest px-3">{label}</span>
      ) : (
        <span className="text-primary/40 font-cinzel text-lg">𒂗</span>
      )}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}

export default function Home() {
  const { data: settings } = useGetSettings();
  const { data: sections } = useListSections();
  const { data: news } = useListNews({ limit: 6 });
  const { data: featuredPlatforms } = useListPlatforms({ featured: true });
  const { data: ads } = useListAdvertisements({ active: true });
  const { data: stats } = useGetStats();
  const sectionsRef = useRef<HTMLElement>(null);

  const pinnedNews = news?.filter((n) => n.isPinned && n.isPublished) || [];
  const latestNews = news?.filter((n) => n.isPublished) || [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center w-full" dir="rtl">

      {/* ── HERO ── */}
      <section className="relative w-full flex flex-col overflow-hidden">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(43_89%_52%_/_0.07)_0%,_transparent_70%)] z-0" />
        {/* Large decorative Sumerian character */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none z-0 select-none">
          <span className="font-cinzel text-[28vw] text-primary leading-none">𒀭</span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full pt-12 pb-10 md:pt-20 md:pb-16">
          {/* Logo mark above title */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="flex justify-center mb-6 md:mb-8">
            <div className="relative w-20 h-20 md:w-32 md:h-32">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
              <img
                src="/alpha-logo.png"
                alt="Alpha Platform"
                className="relative w-full h-full object-contain drop-shadow-[0_0_24px_hsl(43_89%_52%_/_0.4)]"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-cinzel text-5xl sm:text-7xl md:text-8xl font-black text-primary leading-none tracking-tight mb-4"
            style={{ textShadow: "0 0 60px hsl(43 89% 52% / 0.25)" }}
          >
            {settings?.heroTitle || "Alpha Platform"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-tajawal text-xl md:text-3xl text-foreground/70 mb-2"
          >
            {settings?.heroTitleAr || "منصة ألفا"}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-tajawal text-sm md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {settings?.heroSubtitleAr || "بوابتك نحو التقنية والمعرفة — ذكاء اصطناعي، تعليم، رياضة، هندسة، وأكثر"}
          </motion.p>

          {/* Sumerian decorative text */}
          {settings?.sumerianText && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              className="font-cinzel text-primary/30 text-xl tracking-[0.4em] mb-8 select-none">
              {settings.sumerianText}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => sectionsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 py-3 md:px-8 md:py-3.5 bg-primary text-primary-foreground font-tajawal font-bold rounded-lg hover:bg-accent transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 text-sm md:text-base"
            >
              استكشف الأقسام
            </button>
            <Link href="/news">
              <div className="px-6 py-3 md:px-8 md:py-3.5 border border-primary/40 text-primary font-tajawal font-bold rounded-lg hover:bg-primary/10 transition-all hover:-translate-y-0.5 text-sm md:text-base">
                آخر الأخبار
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Stats bar — in normal flow, not absolute */}
        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative z-10 w-full bg-card/60 border-t border-primary/15 backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-center gap-6 md:gap-16">
              {[
                { label: "قسم", value: stats.totalSections },
                { label: "منصة", value: stats.totalPlatforms },
                { label: "خبر", value: stats.totalNews },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="font-cinzel text-xl md:text-2xl text-primary font-bold">{value}</span>
                  <span className="font-tajawal text-muted-foreground text-xs md:text-sm">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom border line */}
        <div className="relative z-10 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </section>

      {/* ── ACTIVE ADS ── */}
      {ads && ads.length > 0 && (
        <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {ads.map((ad) => (
              ad.linkUrl ? (
                <a key={ad.id} href={ad.linkUrl} target="_blank" rel="noopener noreferrer"
                  className="shrink-0 rounded-xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all group">
                  {ad.imageUrl
                    ? <img src={ad.imageUrl} alt={ad.title} className="h-24 w-auto object-cover group-hover:scale-105 transition-transform" />
                    : <div className="h-24 w-64 bg-card flex items-center justify-center"><p className="font-tajawal text-primary text-sm">{ad.title}</p></div>
                  }
                </a>
              ) : (
                <div key={ad.id} className="shrink-0 rounded-xl overflow-hidden border border-primary/20">
                  {ad.imageUrl
                    ? <img src={ad.imageUrl} alt={ad.title} className="h-24 w-auto object-cover" />
                    : <div className="h-24 w-64 bg-card flex items-center justify-center"><p className="font-tajawal text-primary text-sm">{ad.title}</p></div>
                  }
                </div>
              )
            ))}
          </div>
        </section>
      )}

      {/* ── SECTIONS GRID ── */}
      <section ref={sectionsRef} id="sections" className="w-full max-w-7xl mx-auto py-16 px-6">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <h2 className="font-cinzel text-4xl text-primary font-bold mb-2">الأقسام</h2>
          <p className="font-tajawal text-muted-foreground">استكشف مجالات منصة ألفا المتنوعة</p>
          <MesopotamianDivider />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {sections?.filter((s) => s.isActive).map((section, i) => {
            const Icon = ICON_MAP[section.icon] || Folder;
            return (
              <motion.div key={section.id} {...fadeUp(i * 0.07)}>
                <Link href={`/sections/${section.slug}`}>
                  <div className="group relative bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/60 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors group-hover:border-primary/40">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-tajawal text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                        {section.nameAr || section.name}
                      </h3>
                      <p className="font-cinzel text-xs text-muted-foreground mb-3">{section.name}</p>
                      {(section.descriptionAr || section.description) && (
                        <p className="font-tajawal text-sm text-muted-foreground line-clamp-2">
                          {section.descriptionAr || section.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-4 text-primary/60 group-hover:text-primary transition-colors">
                        <span className="font-tajawal text-xs">استكشف</span>
                        <ChevronLeft className="w-3 h-3 rotate-180" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED PLATFORMS ── */}
      {featuredPlatforms && featuredPlatforms.length > 0 && (
        <section className="w-full bg-card/30 border-y border-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fadeUp()} className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-primary fill-primary" />
                <h2 className="font-cinzel text-4xl text-primary font-bold">المميزة</h2>
                <Star className="w-5 h-5 text-primary fill-primary" />
              </div>
              <p className="font-tajawal text-muted-foreground">أبرز منصات وأدوات ألفا</p>
              <MesopotamianDivider />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredPlatforms.slice(0, 8).map((p, i) => {
                const TypeIcon = TYPE_ICON[p.type] || Globe;
                return (
                  <motion.div key={p.id} {...fadeUp(i * 0.07)}>
                    <div className="bg-card border border-primary/20 rounded-xl p-5 hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/10 h-full flex flex-col">
                      {p.imageUrl && (
                        <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-tajawal font-bold text-foreground group-hover:text-primary transition-colors">
                          {p.nameAr || p.name}
                        </h3>
                        <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                          <TypeIcon className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <Badge className="w-fit bg-secondary/50 text-secondary-foreground text-xs font-tajawal mb-2">{TYPE_LABEL_AR[p.type] || p.type}</Badge>
                      {(p.descriptionAr || p.description) && (
                        <p className="font-tajawal text-sm text-muted-foreground line-clamp-2 mb-4">
                          {p.descriptionAr || p.description}
                        </p>
                      )}
                      {p.url && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <div className="w-full text-center py-2 rounded-lg border border-primary/30 text-primary text-sm font-tajawal hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                            <ExternalLink className="w-3.5 h-3.5" />
                            {p.type === "telegram_bot" ? "فتح البوت" : "زيارة"}
                          </div>
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWS ── */}
      <section className="w-full max-w-7xl mx-auto py-16 px-6">
        <motion.div {...fadeUp()} className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-cinzel text-4xl text-primary font-bold mb-1">الأخبار</h2>
            <p className="font-tajawal text-muted-foreground text-sm">أحدث تطويرات وأخبار منصة ألفا</p>
          </div>
          <Link href="/news">
            <div className="flex items-center gap-2 text-primary hover:text-accent font-tajawal text-sm transition-colors border border-primary/30 rounded-lg px-4 py-2 hover:bg-primary/10">
              عرض الكل
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </div>
          </Link>
        </motion.div>

        <MesopotamianDivider />

        {/* Pinned news - highlighted */}
        {pinnedNews.length > 0 && (
          <div className="mb-8 mt-6">
            {pinnedNews.slice(0, 1).map((post) => (
              <motion.div key={post.id} {...fadeUp(0.1)}>
                <Link href={`/news/${post.slug}`}>
                  <div className="group relative bg-card border border-primary/40 rounded-2xl overflow-hidden hover:border-primary transition-all hover:shadow-xl hover:shadow-primary/10 cursor-pointer">
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 bg-primary/90 text-primary-foreground rounded-full px-3 py-1 text-xs font-tajawal">
                        <Pin className="w-3 h-3" /> مثبت
                      </div>
                    </div>
                    {post.imageUrl && (
                      <div className="w-full h-52 overflow-hidden">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {post.category && <Badge className="bg-primary/20 text-primary border-primary/30 font-tajawal text-xs">{post.category}</Badge>}
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Calendar className="w-3 h-3" />
                          <span className="font-tajawal">{new Date(post.createdAt).toLocaleDateString("ar-IQ")}</span>
                        </div>
                      </div>
                      <h3 className="font-tajawal text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {post.titleAr || post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="font-tajawal text-muted-foreground leading-relaxed">{post.excerpt}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {latestNews.filter((n) => !n.isPinned).slice(0, 6).map((post, i) => (
            <motion.div key={post.id} {...fadeUp(i * 0.08)}>
              <Link href={`/news/${post.slug}`}>
                <div className="group bg-card border border-primary/20 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/10 h-full flex flex-col">
                  {post.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {post.category && <Badge className="bg-secondary/60 text-secondary-foreground font-tajawal text-xs">{post.category}</Badge>}
                      <span className="text-xs text-muted-foreground font-tajawal">{new Date(post.createdAt).toLocaleDateString("ar-IQ")}</span>
                    </div>
                    <h3 className="font-tajawal text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1 mb-2">
                      {post.titleAr || post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="font-tajawal text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {latestNews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="font-cinzel text-5xl text-primary/20">𒁾</span>
            <p className="font-tajawal text-muted-foreground">لا توجد أخبار بعد</p>
          </div>
        )}
      </section>

      {/* ── SUMERIAN BOTTOM DECORATION ── */}
      <section className="w-full border-t border-primary/10 py-10 bg-card/20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-cinzel text-primary/20 text-3xl tracking-[0.4em] select-none">
            𒀭 𒂗 𒈬 𒄑 𒅆 𒊏 𒁾
          </p>
          <p className="font-tajawal text-muted-foreground/40 text-xs mt-3">
            {settings?.footerTextAr || "منصة ألفا — بوابتك نحو المستقبل"}
          </p>
        </div>
      </section>

    </div>
  );
}
