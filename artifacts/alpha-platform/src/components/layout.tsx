import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useGetSettings, useListSections } from "@workspace/api-client-react";
import { Menu, X, Bot, Brain, GraduationCap, Dumbbell, Cpu, Film, Folder, Mail, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
);
const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
);

const SOCIAL_ICONS: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  socialTelegram:  { icon: TelegramIcon,  label: "تلغرام",   color: "hover:text-[#29A9EB]" },
  socialWhatsapp:  { icon: WhatsappIcon,  label: "واتساب",   color: "hover:text-[#25D366]" },
  socialTwitter:   { icon: () => <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, label: "تويتر", color: "hover:text-foreground" },
  socialInstagram: { icon: InstagramIcon, label: "انستقرام", color: "hover:text-[#E4405F]" },
  socialYoutube:   { icon: YoutubeIcon,   label: "يوتيوب",   color: "hover:text-[#FF0000]" },
  socialFacebook:  { icon: FacebookIcon,  label: "فيسبوك",   color: "hover:text-[#1877F2]" },
  socialTiktok:    { icon: TiktokIcon,    label: "تيك توك",  color: "hover:text-foreground" },
};

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
      <footer className="w-full border-t border-primary/20 bg-card" dir="rtl">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="container mx-auto px-6 py-12">
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img src={logoSrc} alt="Alpha" className="w-12 h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div>
                  <div className="font-cinzel text-xl text-primary tracking-widest font-bold">{settings?.siteName || "ALPHA PLATFORM"}</div>
                  {settings?.siteNameAr && <div className="font-tajawal text-sm text-muted-foreground">{settings.siteNameAr}</div>}
                </div>
              </div>
              <p className="font-tajawal text-sm text-muted-foreground leading-relaxed">
                {settings?.heroSubtitleAr || "بوابتك نحو التقنية والمعرفة"}
              </p>
              {/* Sumerian decoration */}
              <div className="flex items-center gap-1.5 text-primary/25 font-cinzel text-lg tracking-widest select-none">
                {(settings?.sumerianText || "𒀭 𒂗 𒈬 𒄑").split(" ").slice(0, 4).map((ch, i) => (
                  <span key={i}>{ch}</span>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div>
              <h4 className="font-tajawal font-bold text-foreground mb-4 text-sm tracking-wide">تابعنا</h4>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(SOCIAL_ICONS) as [string, { icon: React.ElementType; label: string; color: string }][]).map(([key, { icon: Icon, label, color }]) => {
                  const url = (settings as Record<string, unknown>)?.[key] as string | undefined;
                  if (!url) return null;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-muted-foreground ${color} transition-colors group`}>
                      <span className="w-7 h-7 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-primary/10">
                        <Icon />
                      </span>
                      <span className="font-tajawal text-sm">{label}</span>
                    </a>
                  );
                })}
                {/* If no social links set, show placeholder */}
                {!Object.keys(SOCIAL_ICONS).some((k) => (settings as Record<string, unknown>)?.[k]) && (
                  <p className="font-tajawal text-xs text-muted-foreground/50 col-span-2">لم تُضف روابط التواصل بعد</p>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div>
              <h4 className="font-tajawal font-bold text-foreground mb-4 text-sm tracking-wide">تواصل معنا</h4>
              <div className="space-y-3">
                {settings?.contactAddressAr && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="font-tajawal text-sm">{settings.contactAddressAr}</span>
                  </div>
                )}
                {settings?.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-tajawal text-sm" dir="ltr">{settings.contactEmail}</span>
                  </a>
                )}
                {settings?.contactPhone && (
                  <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-tajawal text-sm" dir="ltr">{settings.contactPhone}</span>
                  </a>
                )}
                {!settings?.contactEmail && !settings?.contactPhone && !settings?.contactAddressAr && (
                  <p className="font-tajawal text-xs text-muted-foreground/50">لم تُضف معلومات التواصل بعد</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-tajawal text-xs text-muted-foreground/60">
              {settings?.footerTextAr || "جميع الحقوق محفوظة — منصة ألفا"}
            </p>
            <Link href="/admin">
              <span className="font-cinzel text-xs text-muted-foreground/30 hover:text-primary/50 transition-colors cursor-pointer">ADMIN</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
