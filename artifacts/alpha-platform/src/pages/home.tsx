import React from 'react';
import { useListSections, useGetSettings } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function Home() {
  const { data: settings } = useGetSettings();
  const { data: sections } = useListSections();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center w-full" dir="rtl">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden border-b-2 border-primary/20">
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        {/* Sumerian Watermark Mock */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none z-0">
          <span className="font-cinzel text-[20vw] text-primary">𒀭</span>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-cinzel font-bold text-primary mb-6 drop-shadow-lg"
          >
            {settings?.heroTitle || 'Alpha Platform'}
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl font-tajawal text-foreground/80 mb-8"
          >
            {settings?.heroSubtitleAr || 'منصة ألفا - بوابتك إلى المستقبل'}
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Link href="#sections" className="px-8 py-3 bg-primary text-primary-foreground font-tajawal font-bold rounded hover:bg-accent transition-colors">
              استكشف المنصات
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Sections Grid */}
      <section id="sections" className="w-full max-w-7xl mx-auto py-20 px-4">
        <h3 className="text-3xl font-cinzel text-primary text-center mb-12 flex items-center justify-center gap-4">
          <span className="h-px bg-primary/30 w-12"></span>
          الاقسام
          <span className="h-px bg-primary/30 w-12"></span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections?.map((section) => (
            <Link key={section.id} href={`/sections/${section.slug}`}>
              <Card className="bg-card border-primary/20 hover:border-primary/50 transition-colors cursor-pointer group">
                <CardHeader>
                  <CardTitle className="font-tajawal text-xl text-primary group-hover:text-accent flex items-center justify-between">
                    {section.nameAr || section.name}
                    <span className="text-sm font-cinzel text-muted-foreground">{section.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-tajawal">
                    {section.descriptionAr || section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full bg-card mt-auto border-t border-primary/20 py-8 px-4 text-center">
        <p className="font-tajawal text-muted-foreground">
          {settings?.footerTextAr || 'جميع الحقوق محفوظة منصة ألفا © 2024'}
        </p>
      </footer>
    </div>
  );
}