import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useGetSettings, useListSections } from "@workspace/api-client-react";
import { Menu, X, ChevronDown, Bot, Brain, GraduationCap, Dumbbell, Cpu, Film, Folder } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, React.ElementType> = {
  bot: Bot, brain: Brain, "graduation-cap": GraduationCap, dumbbell: Dumbbell, cpu: Cpu, film: Film, folder: Folder,
};

function SectionsDropdown({ onClose }: { onClose: () => void }) {
  const { data: sections } = useListSections();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 mt-2 w-72 bg-card border border-primary/30 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
      dir="rtl"
    >
      <div className="p-2">
        <p className="px-3 py-2 text-xs text-muted-foreground font-tajawal border-b border-primary/10 mb-1">الأقسام</p>
        {sections?.map((s) => {
          const Icon = ICON_MAP[s.icon] || Folder;
          return (
            <Link key={s.id} href={`/sections/${s.slug}`} onClick={onClose}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 cursor-pointer group transition-colors">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 border border-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-tajawal text-sm text-foreground group-hover:text-primary transition-colors font-medium">
                    {s.nameAr || s.name}
                  </p>
                  <p className="font-cinzel text-xs text-muted-foreground">{s.name}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { data: sections } = useListSections();
  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed inset-0 z-50 bg-background/98 backdrop-blur-lg"
      dir="rtl"
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-primary/20">
          <span className="font-cinzel text-xl text-primary font-bold tracking-wider">ALPHA PLATFORM</span>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-primary/10 text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-2">
          <Link href="/" onClick={onClose}>
            <div className="px-4 py-3 rounded-lg font-tajawal text-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors">الرئيسية</div>
          </Link>
          <Link href="/news" onClick={onClose}>
            <div className="px-4 py-3 rounded-lg font-tajawal text-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors">الأخبار</div>
          </Link>
          <div className="pt-2 pb-1">
            <p className="px-4 text-xs text-muted-foreground font-tajawal mb-2">الأقسام</p>
            {sections?.map((s) => {
              const Icon = ICON_MAP[s.icon] || Folder;
              return (
                <Link key={s.id} href={`/sections/${s.slug}`} onClick={onClose}>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-primary/10 cursor-pointer group transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="font-tajawal text-foreground group-hover:text-primary transition-colors">{s.nameAr || s.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: settings } = useGetSettings();
  const [location] = useLocation();
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSectionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false); }, [location]);

  if (location.startsWith("/admin")) {
    return <>{children}</>;
  }

  const logoSrc = settings?.logoUrl || "/alpha-logo.png";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Subtle gold top bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="container mx-auto flex h-16 items-center justify-between px-4" dir="rtl">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-10 h-10 shrink-0">
                <img
                  src={logoSrc}
                  alt="Alpha Platform Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span className="font-cinzel font-bold text-xl text-primary tracking-widest group-hover:text-accent transition-colors">
                {settings?.siteName || "ALPHA"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/">
              <div className="px-4 py-2 rounded-lg font-tajawal text-sm text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                الرئيسية
              </div>
            </Link>
            <Link href="/news">
              <div className="px-4 py-2 rounded-lg font-tajawal text-sm text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                الأخبار
              </div>
            </Link>

            {/* Sections Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSectionsOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-tajawal text-sm text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                data-testid="button-sections-menu"
              >
                <span>الأقسام</span>
                <div className="flex flex-col gap-[3px]">
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span className="w-1 h-1 rounded-full bg-current" />
                </div>
              </button>
              <AnimatePresence>
                {sectionsOpen && <SectionsDropdown onClose={() => setSectionsOpen(false)} />}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-primary/10 text-foreground transition-colors"
            onClick={() => setMobileOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-primary/20 bg-card">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6" dir="rtl">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Alpha" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <div className="font-cinzel text-lg text-primary tracking-widest">{settings?.siteName || "ALPHA PLATFORM"}</div>
              {settings?.siteNameAr && <div className="font-tajawal text-sm text-muted-foreground">{settings.siteNameAr}</div>}
            </div>
          </div>

          <div className="flex items-center gap-2 text-primary/30 font-cinzel text-xl tracking-widest">
            {(settings?.sumerianText || "𒀭 𒂗 𒈬 𒄑").split(" ").map((ch, i) => (
              <span key={i} className="hover:text-primary/70 transition-colors cursor-default">{ch}</span>
            ))}
          </div>

          <div className="flex flex-col items-end gap-2">
            {settings?.socialTelegram && (
              <a href={settings.socialTelegram} target="_blank" rel="noopener noreferrer" className="font-tajawal text-sm text-muted-foreground hover:text-primary transition-colors">تلغرام</a>
            )}
            {settings?.socialTwitter && (
              <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="font-tajawal text-sm text-muted-foreground hover:text-primary transition-colors">تويتر</a>
            )}
            <p className="font-tajawal text-xs text-muted-foreground/60">
              {settings?.footerTextAr || "جميع الحقوق محفوظة منصة ألفا"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
