import { useParams, Link } from "wouter";
import { useListSections, useListPlatforms } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Bot, Globe, Monitor, Wrench } from "lucide-react";

const TYPE_LABELS: Record<string, { label: string; labelAr: string; icon: React.ElementType; color: string }> = {
  telegram_bot: { label: "Telegram Bot", labelAr: "بوت تلغرام", icon: Bot, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  website: { label: "Website", labelAr: "موقع", icon: Globe, color: "bg-green-500/20 text-green-400 border-green-500/30" },
  program: { label: "Program", labelAr: "برنامج", icon: Monitor, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  tool: { label: "Tool", labelAr: "أداة", icon: Wrench, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
};

export default function SectionDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: sections } = useListSections();
  const section = sections?.find((s) => s.slug === slug);
  const { data: platforms, isLoading } = useListPlatforms(
    section ? { sectionId: section.id } : {},
    { query: { enabled: !!section } }
  );

  if (!sections) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4" dir="rtl">
        <p className="font-tajawal text-xl text-muted-foreground">القسم غير موجود</p>
        <Link href="/">
          <Button variant="outline" className="font-tajawal border-primary/30 text-primary">
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Section Header */}
      <div className="relative w-full border-b border-primary/20 bg-card/50 overflow-hidden">
        <div className="absolute inset-0 opacity-5 flex items-center justify-end pr-16 pointer-events-none">
          <span className="font-cinzel text-[15vw] text-primary">𒀭</span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-tajawal text-sm mb-6">
              <ArrowRight className="w-4 h-4 rotate-180" />
              العودة للرئيسية
            </Link>
            <h1 className="font-cinzel text-4xl md:text-6xl text-primary font-bold mb-2">{section.name}</h1>
            {section.nameAr && (
              <h2 className="font-tajawal text-2xl text-foreground/70 mb-4">{section.nameAr}</h2>
            )}
            {(section.descriptionAr || section.description) && (
              <p className="font-tajawal text-muted-foreground text-lg max-w-2xl">
                {section.descriptionAr || section.description}
              </p>
            )}
          </motion.div>
        </div>
        {/* Mesopotamian Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      {/* Platforms Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : platforms && platforms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, i) => {
              const typeInfo = TYPE_LABELS[platform.type] || TYPE_LABELS.tool;
              const TypeIcon = typeInfo.icon;
              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-300 h-full group hover:shadow-lg hover:shadow-primary/10">
                    {platform.imageUrl && (
                      <div className="w-full h-40 overflow-hidden rounded-t-lg">
                        <img src={platform.imageUrl} alt={platform.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="font-tajawal text-lg text-foreground group-hover:text-primary transition-colors">
                            {platform.nameAr || platform.name}
                          </CardTitle>
                          {platform.nameAr && (
                            <p className="font-cinzel text-xs text-muted-foreground mt-0.5">{platform.name}</p>
                          )}
                        </div>
                        {platform.isFeatured && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 font-tajawal text-xs shrink-0">
                            مميز
                          </Badge>
                        )}
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs border w-fit ${typeInfo.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        <span className="font-tajawal">{typeInfo.labelAr}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      {(platform.descriptionAr || platform.description) && (
                        <p className="text-muted-foreground font-tajawal text-sm leading-relaxed">
                          {platform.descriptionAr || platform.description}
                        </p>
                      )}
                      {platform.tags && (
                        <div className="flex flex-wrap gap-1">
                          {platform.tags.split(",").map((tag) => (
                            <span key={tag.trim()} className="px-2 py-0.5 bg-secondary/50 text-secondary-foreground rounded text-xs font-tajawal">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {platform.url && (
                        <a href={platform.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <Button className="w-full font-tajawal gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 transition-all">
                            <ExternalLink className="w-4 h-4" />
                            {platform.type === "telegram_bot" ? "فتح البوت" : platform.type === "website" ? "زيارة الموقع" : "تحميل"}
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-cinzel text-3xl text-primary">𒀭</span>
            </div>
            <p className="font-tajawal text-muted-foreground text-lg">لا توجد منصات في هذا القسم بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
