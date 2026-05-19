import { Link } from "wouter";
import { useListNews } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, Pin } from "lucide-react";

export default function NewsList() {
  const { data: news, isLoading } = useListNews();

  const pinnedNews = news?.filter((n) => n.isPinned && n.isPublished) || [];
  const regularNews = news?.filter((n) => !n.isPinned && n.isPublished) || [];

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Header */}
      <div className="relative w-full border-b border-primary/20 bg-card/30 overflow-hidden">
        <div className="absolute inset-0 opacity-5 flex items-center justify-start pl-16 pointer-events-none">
          <span className="font-cinzel text-[12vw] text-primary">𒁾</span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-cinzel text-5xl text-primary font-bold mb-3">الأخبار</h1>
            <p className="font-tajawal text-muted-foreground text-lg">أحدث أخبار وتطويرات منصة ألفا</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pinned News */}
            {pinnedNews.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Pin className="w-5 h-5 text-primary" />
                  <h2 className="font-tajawal text-xl text-primary font-bold">مثبت</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {pinnedNews.map((post, i) => (
                    <motion.div key={post.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                      <Link href={`/news/${post.slug}`}>
                        <Card className="bg-card border-primary/40 hover:border-primary cursor-pointer group transition-all">
                          <CardHeader>
                            <div className="flex items-start gap-3">
                              <div className="w-1 self-stretch bg-primary rounded-full shrink-0" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  {post.category && (
                                    <Badge className="bg-primary/20 text-primary border-primary/30 font-tajawal text-xs">{post.category}</Badge>
                                  )}
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-tajawal">{new Date(post.createdAt).toLocaleDateString("ar-IQ")}</span>
                                  </div>
                                </div>
                                <CardTitle className="font-tajawal text-xl text-foreground group-hover:text-primary transition-colors">
                                  {post.titleAr || post.title}
                                </CardTitle>
                                {post.excerpt && (
                                  <p className="font-tajawal text-muted-foreground text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                                )}
                              </div>
                              {post.imageUrl && (
                                <img src={post.imageUrl} alt={post.title} className="w-24 h-20 object-cover rounded shrink-0" />
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Sumerian Divider */}
            {pinnedNews.length > 0 && regularNews.length > 0 && (
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-primary/20" />
                <span className="text-primary/40 font-cinzel text-lg">𒂗</span>
                <div className="flex-1 h-px bg-primary/20" />
              </div>
            )}

            {/* Regular News */}
            {regularNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularNews.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link href={`/news/${post.slug}`}>
                      <Card className="bg-card border-primary/20 hover:border-primary/50 cursor-pointer group transition-all h-full">
                        {post.imageUrl && (
                          <div className="w-full h-44 overflow-hidden rounded-t-lg">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex items-center gap-2 flex-wrap">
                            {post.category && (
                              <Badge className="bg-secondary text-secondary-foreground font-tajawal text-xs">{post.category}</Badge>
                            )}
                            <span className="text-xs text-muted-foreground font-tajawal">
                              {new Date(post.createdAt).toLocaleDateString("ar-IQ")}
                            </span>
                          </div>
                          <CardTitle className="font-tajawal text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {post.titleAr || post.title}
                          </CardTitle>
                        </CardHeader>
                        {post.excerpt && (
                          <CardContent>
                            <p className="font-tajawal text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                          </CardContent>
                        )}
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {!news || news.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <span className="font-cinzel text-5xl text-primary/30">𒁾</span>
                <p className="font-tajawal text-muted-foreground text-lg">لا توجد أخبار بعد</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
