import { useParams, Link } from "wouter";
import { useListNews } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Pin } from "lucide-react";

export default function NewsPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: news } = useListNews();
  const post = news?.find((n) => n.slug === slug);

  if (!news) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4" dir="rtl">
        <p className="font-tajawal text-xl text-muted-foreground">الخبر غير موجود</p>
        <Link href="/news">
          <Button variant="outline" className="font-tajawal border-primary/30 text-primary">
            العودة للأخبار
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {post.imageUrl && (
        <div className="w-full h-64 md:h-96 overflow-hidden relative">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/news" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-tajawal text-sm mb-8">
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة للأخبار
          </Link>

          <div className="flex items-center gap-3 flex-wrap mb-4">
            {post.isPinned && (
              <div className="flex items-center gap-1 text-primary">
                <Pin className="w-4 h-4" />
                <span className="font-tajawal text-xs">مثبت</span>
              </div>
            )}
            {post.category && (
              <Badge className="bg-primary/20 text-primary border-primary/30 font-tajawal">{post.category}</Badge>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span className="font-tajawal">{new Date(post.createdAt).toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>

          <h1 className="font-tajawal text-3xl md:text-4xl font-bold text-foreground mb-2 leading-relaxed">
            {post.titleAr || post.title}
          </h1>
          {post.titleAr && post.title !== post.titleAr && (
            <h2 className="font-cinzel text-xl text-muted-foreground mb-8">{post.title}</h2>
          )}

          {/* Decorative divider */}
          <div className="flex items-center gap-3 my-8">
            <div className="flex-1 h-px bg-primary/20" />
            <span className="text-primary/50 font-cinzel">𒂗</span>
            <div className="flex-1 h-px bg-primary/20" />
          </div>

          {(post.contentAr || post.content) && (
            <div className="font-tajawal text-foreground/90 leading-relaxed text-lg space-y-4 whitespace-pre-wrap">
              {post.contentAr || post.content}
            </div>
          )}

          {post.updatedAt && (
            <p className="mt-12 text-xs text-muted-foreground font-tajawal">
              آخر تحديث: {new Date(post.updatedAt).toLocaleDateString("ar-IQ")}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
