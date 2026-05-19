import React from 'react';
import { Link, useLocation } from 'wouter';
import { useGetSettings } from '@workspace/api-client-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: settings } = useGetSettings();
  const [location] = useLocation();

  if (location.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteNameAr || 'Logo'} className="h-8 w-8 object-contain" />
              ) : (
                <div className="h-8 w-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-cinzel font-bold">
                  A
                </div>
              )}
              <span className="font-cinzel font-bold text-xl text-primary tracking-wider">
                {settings?.siteName || 'ALPHA'}
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="font-tajawal text-foreground hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="/news" className="font-tajawal text-foreground hover:text-primary transition-colors">
              الأخبار
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-primary/20 bg-card py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-cinzel text-xl text-primary tracking-widest">
            {settings?.siteName || 'ALPHA PLATFORM'}
          </div>
          <p className="font-tajawal text-muted-foreground text-center">
            {settings?.footerTextAr || 'جميع الحقوق محفوظة منصة ألفا © 2024'}
          </p>
          <div className="flex gap-4">
            {/* Social Links would go here */}
          </div>
        </div>
      </footer>
    </div>
  );
}