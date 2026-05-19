import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  useGetStats, useGetSettings, useUpdateSettings,
  useListSections, useCreateSection, useUpdateSection, useDeleteSection,
  useListPlatforms, useCreatePlatform, useUpdatePlatform, useDeletePlatform,
  useListNews, useCreateNewsPost, useUpdateNewsPost, useDeleteNewsPost,
  useListAdvertisements, useCreateAdvertisement, useUpdateAdvertisement, useDeleteAdvertisement,
  getGetStatsQueryKey, getListSectionsQueryKey, getListPlatformsQueryKey,
  getListNewsQueryKey, getListAdvertisementsQueryKey, getGetSettingsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  LayoutDashboard, Layers, Monitor, Newspaper, Megaphone, Settings,
  Plus, Pencil, Trash2, LogOut, BarChart3, Users, Globe, Bot,
  Wrench, Star, Eye, EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_KEY = "alpha_admin_auth";

type Section = { id: number; name: string; nameAr?: string | null; slug: string; icon: string; description?: string | null; descriptionAr?: string | null; order: number; isActive: boolean };
type Platform = { id: number; name: string; nameAr?: string | null; slug: string; description?: string | null; descriptionAr?: string | null; type: string; url?: string | null; imageUrl?: string | null; sectionId: number; isActive: boolean; isFeatured: boolean; order: number; tags?: string | null };
type NewsPost = { id: number; title: string; titleAr?: string | null; slug: string; content?: string | null; contentAr?: string | null; excerpt?: string | null; imageUrl?: string | null; isPinned: boolean; isPublished: boolean; category?: string | null };
type Ad = { id: number; title: string; imageUrl?: string | null; linkUrl?: string | null; position?: string | null; isActive: boolean; order: number };

function SectionForm({ initial, sections, onSave, onCancel }: { initial?: Partial<Section>; sections?: Section[]; onSave: (d: Record<string, unknown>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ name: "", nameAr: "", slug: "", icon: "folder", description: "", descriptionAr: "", order: 0, isActive: true, ...initial });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="grid gap-4" dir="rtl">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="font-tajawal mb-1 block">الاسم (English)</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-background border-primary/20" /></div>
        <div><Label className="font-tajawal mb-1 block">الاسم (عربي)</Label><Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className="bg-background border-primary/20 text-right" dir="rtl" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="font-tajawal mb-1 block">Slug</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
        <div><Label className="font-tajawal mb-1 block">الأيقونة (lucide name)</Label><Input value={form.icon} onChange={(e) => set("icon", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
      </div>
      <div><Label className="font-tajawal mb-1 block">الوصف (عربي)</Label><Textarea value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} className="bg-background border-primary/20 text-right" dir="rtl" rows={3} /></div>
      <div><Label className="font-tajawal mb-1 block">Description (English)</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-background border-primary/20" rows={2} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="font-tajawal mb-1 block">الترتيب</Label><Input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} className="bg-background border-primary/20" /></div>
        <div className="flex items-center gap-3 pt-6"><Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} /><Label className="font-tajawal">نشط</Label></div>
      </div>
      <div className="flex gap-2 justify-start mt-2">
        <Button onClick={() => onSave(form)} className="font-tajawal bg-primary text-primary-foreground">حفظ</Button>
        <Button variant="outline" onClick={onCancel} className="font-tajawal border-primary/30">إلغاء</Button>
      </div>
    </div>
  );
}

function PlatformForm({ initial, sections, onSave, onCancel }: { initial?: Partial<Platform>; sections?: Section[]; onSave: (d: Record<string, unknown>) => void; onCancel: () => void }) {
  const defaultSectionId = initial?.sectionId ?? sections?.[0]?.id ?? 0;
  const [form, setForm] = useState({ name: "", nameAr: "", slug: "", type: "telegram_bot", url: "", imageUrl: "", sectionId: defaultSectionId, description: "", descriptionAr: "", isActive: true, isFeatured: false, order: 0, tags: "", ...initial, sectionId: defaultSectionId });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="grid gap-4" dir="rtl">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="font-tajawal mb-1 block">الاسم (English)</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-background border-primary/20" /></div>
        <div><Label className="font-tajawal mb-1 block">الاسم (عربي)</Label><Input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className="bg-background border-primary/20" dir="rtl" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="font-tajawal mb-1 block">Slug</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
        <div><Label className="font-tajawal mb-1 block">النوع</Label>
          <Select value={form.type} onValueChange={(v) => set("type", v)}>
            <SelectTrigger className="bg-background border-primary/20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="telegram_bot">بوت تلغرام</SelectItem>
              <SelectItem value="website">موقع</SelectItem>
              <SelectItem value="program">برنامج</SelectItem>
              <SelectItem value="tool">أداة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div><Label className="font-tajawal mb-1 block">القسم</Label>
        <Select value={String(form.sectionId)} onValueChange={(v) => set("sectionId", parseInt(v))}>
          <SelectTrigger className="bg-background border-primary/20"><SelectValue /></SelectTrigger>
          <SelectContent>
            {sections?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.nameAr || s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div><Label className="font-tajawal mb-1 block">الرابط</Label><Input value={form.url} onChange={(e) => set("url", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
      <div><Label className="font-tajawal mb-1 block">رابط الصورة</Label><Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
      <div><Label className="font-tajawal mb-1 block">الوصف (عربي)</Label><Textarea value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} className="bg-background border-primary/20" dir="rtl" rows={2} /></div>
      <div><Label className="font-tajawal mb-1 block">Description (English)</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-background border-primary/20" rows={2} /></div>
      <div><Label className="font-tajawal mb-1 block">الوسوم (مفصولة بفواصل)</Label><Input value={form.tags} onChange={(e) => set("tags", e.target.value)} className="bg-background border-primary/20" /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label className="font-tajawal mb-1 block">الترتيب</Label><Input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} className="bg-background border-primary/20" /></div>
        <div className="flex items-center gap-2 pt-6"><Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} /><Label className="font-tajawal text-sm">نشط</Label></div>
        <div className="flex items-center gap-2 pt-6"><Switch checked={form.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} /><Label className="font-tajawal text-sm">مميز</Label></div>
      </div>
      <div className="flex gap-2 justify-start mt-2">
        <Button onClick={() => onSave(form)} className="font-tajawal bg-primary text-primary-foreground">حفظ</Button>
        <Button variant="outline" onClick={onCancel} className="font-tajawal border-primary/30">إلغاء</Button>
      </div>
    </div>
  );
}

function NewsForm({ initial, onSave, onCancel }: { initial?: Partial<NewsPost>; onSave: (d: Record<string, unknown>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ title: "", titleAr: "", slug: "", content: "", contentAr: "", excerpt: "", imageUrl: "", isPinned: false, isPublished: true, category: "", ...initial });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="grid gap-4" dir="rtl">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="font-tajawal mb-1 block">العنوان (English)</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-background border-primary/20" /></div>
        <div><Label className="font-tajawal mb-1 block">العنوان (عربي)</Label><Input value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} className="bg-background border-primary/20" dir="rtl" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="font-tajawal mb-1 block">Slug</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
        <div><Label className="font-tajawal mb-1 block">الفئة</Label><Input value={form.category} onChange={(e) => set("category", e.target.value)} className="bg-background border-primary/20" /></div>
      </div>
      <div><Label className="font-tajawal mb-1 block">الملخص</Label><Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="bg-background border-primary/20" dir="rtl" rows={2} /></div>
      <div><Label className="font-tajawal mb-1 block">المحتوى (عربي)</Label><Textarea value={form.contentAr} onChange={(e) => set("contentAr", e.target.value)} className="bg-background border-primary/20" dir="rtl" rows={6} /></div>
      <div><Label className="font-tajawal mb-1 block">Content (English)</Label><Textarea value={form.content} onChange={(e) => set("content", e.target.value)} className="bg-background border-primary/20" rows={4} /></div>
      <div><Label className="font-tajawal mb-1 block">رابط الصورة</Label><Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2"><Switch checked={form.isPinned} onCheckedChange={(v) => set("isPinned", v)} /><Label className="font-tajawal">مثبت</Label></div>
        <div className="flex items-center gap-2"><Switch checked={form.isPublished} onCheckedChange={(v) => set("isPublished", v)} /><Label className="font-tajawal">منشور</Label></div>
      </div>
      <div className="flex gap-2 mt-2">
        <Button onClick={() => onSave(form)} className="font-tajawal bg-primary text-primary-foreground">حفظ</Button>
        <Button variant="outline" onClick={onCancel} className="font-tajawal border-primary/30">إلغاء</Button>
      </div>
    </div>
  );
}

function AdForm({ initial, onSave, onCancel }: { initial?: Partial<Ad>; onSave: (d: Record<string, unknown>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ title: "", imageUrl: "", linkUrl: "", position: "banner", isActive: true, order: 0, ...initial });
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="grid gap-4" dir="rtl">
      <div><Label className="font-tajawal mb-1 block">العنوان</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-background border-primary/20" /></div>
      <div><Label className="font-tajawal mb-1 block">رابط الصورة</Label><Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
      <div><Label className="font-tajawal mb-1 block">رابط الإعلان</Label><Input value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="font-tajawal mb-1 block">الموقع</Label>
          <Select value={form.position} onValueChange={(v) => set("position", v)}>
            <SelectTrigger className="bg-background border-primary/20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="banner">بانر</SelectItem>
              <SelectItem value="sidebar">جانبي</SelectItem>
              <SelectItem value="footer">تذييل</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label className="font-tajawal mb-1 block">الترتيب</Label><Input type="number" value={form.order} onChange={(e) => set("order", parseInt(e.target.value) || 0)} className="bg-background border-primary/20" /></div>
      </div>
      <div className="flex items-center gap-2"><Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} /><Label className="font-tajawal">نشط</Label></div>
      <div className="flex gap-2 mt-2">
        <Button onClick={() => onSave(form)} className="font-tajawal bg-primary text-primary-foreground">حفظ</Button>
        <Button variant="outline" onClick={onCancel} className="font-tajawal border-primary/30">إلغاء</Button>
      </div>
    </div>
  );
}

function SettingsEditor() {
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<Record<string, unknown>>({});
  useEffect(() => { if (settings) setForm({ ...settings }); }, [settings]);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const save = async () => {
    await updateSettings.mutateAsync({ data: form as Record<string, string> });
    await qc.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
    toast({ title: "تم الحفظ", description: "تم حفظ الإعدادات بنجاح" });
  };

  if (!settings) return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <Tabs defaultValue="general" dir="rtl">
      <TabsList className="grid grid-cols-4 mb-6 bg-card border border-primary/20">
        <TabsTrigger value="general" className="font-tajawal">عام</TabsTrigger>
        <TabsTrigger value="appearance" className="font-tajawal">المظهر</TabsTrigger>
        <TabsTrigger value="content" className="font-tajawal">المحتوى</TabsTrigger>
        <TabsTrigger value="social" className="font-tajawal">التواصل</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="font-tajawal mb-1 block">اسم المنصة (English)</Label><Input value={String(form.siteName || "")} onChange={(e) => set("siteName", e.target.value)} className="bg-background border-primary/20" /></div>
          <div><Label className="font-tajawal mb-1 block">اسم المنصة (عربي)</Label><Input value={String(form.siteNameAr || "")} onChange={(e) => set("siteNameAr", e.target.value)} className="bg-background border-primary/20" dir="rtl" /></div>
        </div>
        <div><Label className="font-tajawal mb-1 block">رابط اللوجو</Label><Input value={String(form.logoUrl || "")} onChange={(e) => set("logoUrl", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
        <div><Label className="font-tajawal mb-1 block">رابط الفافيكون</Label><Input value={String(form.faviconUrl || "")} onChange={(e) => set("faviconUrl", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
        <div><Label className="font-tajawal mb-1 block">كلمة مرور الإدارة</Label><Input type="password" value={String(form.adminPassword || "")} onChange={(e) => set("adminPassword", e.target.value)} className="bg-background border-primary/20" dir="ltr" /></div>
        <div className="flex items-center gap-3"><Switch checked={Boolean(form.maintenanceMode)} onCheckedChange={(v) => set("maintenanceMode", v)} /><Label className="font-tajawal">وضع الصيانة</Label></div>
      </TabsContent>

      <TabsContent value="appearance" className="grid gap-4">
        <div className="grid grid-cols-3 gap-3">
          <div><Label className="font-tajawal mb-1 block">اللون الرئيسي</Label><Input value={String(form.primaryColor || "")} onChange={(e) => set("primaryColor", e.target.value)} className="bg-background border-primary/20" /></div>
          <div><Label className="font-tajawal mb-1 block">اللون الثانوي</Label><Input value={String(form.secondaryColor || "")} onChange={(e) => set("secondaryColor", e.target.value)} className="bg-background border-primary/20" /></div>
          <div><Label className="font-tajawal mb-1 block">لون الإبراز</Label><Input value={String(form.accentColor || "")} onChange={(e) => set("accentColor", e.target.value)} className="bg-background border-primary/20" /></div>
        </div>
        <div><Label className="font-tajawal mb-1 block">النص السومري (للزخرفة)</Label><Input value={String(form.sumerianText || "")} onChange={(e) => set("sumerianText", e.target.value)} className="bg-background border-primary/20 font-mono" /></div>
      </TabsContent>

      <TabsContent value="content" className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="font-tajawal mb-1 block">عنوان الهيرو (English)</Label><Input value={String(form.heroTitle || "")} onChange={(e) => set("heroTitle", e.target.value)} className="bg-background border-primary/20" /></div>
          <div><Label className="font-tajawal mb-1 block">عنوان الهيرو (عربي)</Label><Input value={String(form.heroTitleAr || "")} onChange={(e) => set("heroTitleAr", e.target.value)} className="bg-background border-primary/20" dir="rtl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="font-tajawal mb-1 block">النص الفرعي (English)</Label><Textarea value={String(form.heroSubtitle || "")} onChange={(e) => set("heroSubtitle", e.target.value)} className="bg-background border-primary/20" rows={3} /></div>
          <div><Label className="font-tajawal mb-1 block">النص الفرعي (عربي)</Label><Textarea value={String(form.heroSubtitleAr || "")} onChange={(e) => set("heroSubtitleAr", e.target.value)} className="bg-background border-primary/20" dir="rtl" rows={3} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="font-tajawal mb-1 block">نص التذييل (English)</Label><Input value={String(form.footerText || "")} onChange={(e) => set("footerText", e.target.value)} className="bg-background border-primary/20" /></div>
          <div><Label className="font-tajawal mb-1 block">نص التذييل (عربي)</Label><Input value={String(form.footerTextAr || "")} onChange={(e) => set("footerTextAr", e.target.value)} className="bg-background border-primary/20" dir="rtl" /></div>
        </div>
      </TabsContent>

      <TabsContent value="social" className="grid gap-4">
        <div><Label className="font-tajawal mb-1 block">تلغرام</Label><Input value={String(form.socialTelegram || "")} onChange={(e) => set("socialTelegram", e.target.value)} className="bg-background border-primary/20" dir="ltr" placeholder="https://t.me/..." /></div>
        <div><Label className="font-tajawal mb-1 block">تويتر / X</Label><Input value={String(form.socialTwitter || "")} onChange={(e) => set("socialTwitter", e.target.value)} className="bg-background border-primary/20" dir="ltr" placeholder="https://x.com/..." /></div>
        <div><Label className="font-tajawal mb-1 block">يوتيوب</Label><Input value={String(form.socialYoutube || "")} onChange={(e) => set("socialYoutube", e.target.value)} className="bg-background border-primary/20" dir="ltr" placeholder="https://youtube.com/..." /></div>
      </TabsContent>

      <Button onClick={save} disabled={updateSettings.isPending} className="mt-6 font-tajawal bg-primary text-primary-foreground px-8">
        {updateSettings.isPending ? "جاري الحفظ..." : "حفظ جميع الإعدادات"}
      </Button>
    </Tabs>
  );
}

const NAV_ITEMS = [
  { key: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { key: "sections", label: "الأقسام", icon: Layers },
  { key: "platforms", label: "المنصات", icon: Monitor },
  { key: "news", label: "الأخبار", icon: Newspaper },
  { key: "ads", label: "الإعلانات", icon: Megaphone },
  { key: "settings", label: "الإعدادات", icon: Settings },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem(ADMIN_KEY) === "1");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [addingSection, setAddingSection] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [addingPlatform, setAddingPlatform] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsPost | null>(null);
  const [addingNews, setAddingNews] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [addingAd, setAddingAd] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: settings } = useGetSettings();
  const { data: stats } = useGetStats({ query: { enabled: isAuthenticated } });
  const { data: sections } = useListSections();
  const { data: platforms } = useListPlatforms({}, { query: { enabled: isAuthenticated } });
  const { data: news } = useListNews({}, { query: { enabled: isAuthenticated } });
  const { data: ads } = useListAdvertisements({}, { query: { enabled: isAuthenticated } });

  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const createPlatform = useCreatePlatform();
  const updatePlatform = useUpdatePlatform();
  const deletePlatform = useDeletePlatform();
  const createNews = useCreateNewsPost();
  const updateNews = useUpdateNewsPost();
  const deleteNews = useDeleteNewsPost();
  const createAd = useCreateAdvertisement();
  const updateAd = useUpdateAdvertisement();
  const deleteAd = useDeleteAdvertisement();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = settings?.adminPassword || "alpha2024";
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_KEY, "1");
    } else {
      toast({ title: "خطأ", description: "كلمة المرور غير صحيحة", variant: "destructive" });
    }
  };

  const logout = () => { setIsAuthenticated(false); localStorage.removeItem(ADMIN_KEY); };

  const inv = (keys: Parameters<typeof qc.invalidateQueries>[0][]) => keys.forEach((k) => qc.invalidateQueries(k));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4" dir="rtl">
        <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
          <span className="font-cinzel text-[30vw] text-primary">𒀭</span>
        </div>
        <Card className="w-full max-w-md bg-card border-primary/30 relative z-10">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
              <span className="font-cinzel text-3xl text-primary font-bold">A</span>
            </div>
            <CardTitle className="font-cinzel text-2xl text-primary">ALPHA PLATFORM</CardTitle>
            <p className="font-tajawal text-muted-foreground text-sm mt-1">لوحة التحكم</p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <Label className="font-tajawal mb-2 block">كلمة المرور</Label>
                <Input type="password" placeholder="أدخل كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="font-tajawal text-right bg-background border-primary/30 focus:border-primary" dir="rtl" data-testid="input-admin-password" />
              </div>
              <Button type="submit" className="w-full font-tajawal bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" data-testid="button-admin-login">دخول</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-sidebar border-l border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="font-cinzel text-xl text-primary font-bold tracking-wider">ALPHA</div>
          <div className="font-tajawal text-xs text-muted-foreground mt-0.5">لوحة التحكم</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-tajawal text-sm transition-colors ${activeTab === key ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
              data-testid={`nav-${key}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="w-full font-tajawal border-primary/30 text-xs gap-2">
              <Globe className="w-3 h-3" /> عرض الموقع
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={logout} className="w-full font-tajawal text-destructive hover:text-destructive hover:bg-destructive/10 text-xs gap-2">
            <LogOut className="w-3 h-3" /> خروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="font-cinzel text-3xl text-primary mb-8">Dashboard</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "الأقسام", value: stats?.totalSections || 0, icon: Layers },
                  { label: "المنصات", value: stats?.totalPlatforms || 0, icon: Monitor },
                  { label: "الأخبار", value: stats?.totalNews || 0, icon: Newspaper },
                  { label: "منصات نشطة", value: stats?.activePlatforms || 0, icon: Globe },
                ].map(({ label, value, icon: Icon }) => (
                  <Card key={label} className="bg-card border-primary/20">
                    <CardContent className="pt-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-3xl font-cinzel text-primary">{value}</p>
                        <p className="font-tajawal text-sm text-muted-foreground">{label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {stats?.platformsBySection && stats.platformsBySection.length > 0 && (
                <Card className="bg-card border-primary/20">
                  <CardHeader><CardTitle className="font-tajawal text-lg text-foreground">المنصات حسب القسم</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.platformsBySection.map((item) => (
                        <div key={item.sectionId} className="flex items-center gap-3">
                          <span className="font-tajawal text-sm text-foreground w-32 truncate">{item.sectionName}</span>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${Math.min(100, (item.count / (stats.totalPlatforms || 1)) * 100)}%` }} />
                          </div>
                          <span className="font-cinzel text-sm text-primary w-6 text-left">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Sections */}
          {activeTab === "sections" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-cinzel text-3xl text-primary">الأقسام</h1>
                <Button onClick={() => setAddingSection(true)} className="font-tajawal bg-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> إضافة قسم</Button>
              </div>
              {addingSection && (
                <Card className="bg-card border-primary/30 mb-6">
                  <CardHeader><CardTitle className="font-tajawal text-lg text-primary">قسم جديد</CardTitle></CardHeader>
                  <CardContent>
                    <SectionForm onSave={async (d) => { await createSection.mutateAsync({ data: d as Parameters<typeof createSection.mutateAsync>[0]["data"] }); inv([{ queryKey: getListSectionsQueryKey() }]); setAddingSection(false); toast({ title: "تم إضافة القسم" }); }} onCancel={() => setAddingSection(false)} />
                  </CardContent>
                </Card>
              )}
              <div className="space-y-3">
                {sections?.map((s) => (
                  <Card key={s.id} className="bg-card border-primary/20">
                    <CardContent className="pt-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-tajawal text-foreground font-medium">{s.nameAr || s.name} <span className="text-muted-foreground text-sm font-cinzel ml-2">{s.name}</span></p>
                        <p className="font-mono text-xs text-muted-foreground">{s.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={s.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-muted text-muted-foreground"}>{s.isActive ? "نشط" : "معطل"}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => setEditingSection(s)} className="text-primary hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={async () => { await deleteSection.mutateAsync({ id: s.id }); inv([{ queryKey: getListSectionsQueryKey() }]); toast({ title: "تم حذف القسم" }); }} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                    {editingSection?.id === s.id && (
                      <CardContent>
                        <SectionForm initial={s as Partial<Section>} onSave={async (d) => { await updateSection.mutateAsync({ id: s.id, data: d as Parameters<typeof updateSection.mutateAsync>[0]["data"] }); inv([{ queryKey: getListSectionsQueryKey() }]); setEditingSection(null); toast({ title: "تم تحديث القسم" }); }} onCancel={() => setEditingSection(null)} />
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Platforms */}
          {activeTab === "platforms" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-cinzel text-3xl text-primary">المنصات</h1>
                <Button onClick={() => setAddingPlatform(true)} className="font-tajawal bg-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> إضافة منصة</Button>
              </div>
              {addingPlatform && (
                <Card className="bg-card border-primary/30 mb-6">
                  <CardHeader><CardTitle className="font-tajawal text-lg text-primary">منصة جديدة</CardTitle></CardHeader>
                  <CardContent><PlatformForm sections={sections as Section[]} onSave={async (d) => { await createPlatform.mutateAsync({ data: d as Parameters<typeof createPlatform.mutateAsync>[0]["data"] }); inv([{ queryKey: getListPlatformsQueryKey({}) }]); setAddingPlatform(false); toast({ title: "تم إضافة المنصة" }); }} onCancel={() => setAddingPlatform(false)} /></CardContent>
                </Card>
              )}
              <div className="space-y-3">
                {platforms?.map((p) => (
                  <Card key={p.id} className="bg-card border-primary/20">
                    <CardContent className="pt-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-tajawal text-foreground font-medium">{p.nameAr || p.name} <span className="text-muted-foreground text-sm font-cinzel ml-2">{p.name}</span></p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-secondary/50 text-secondary-foreground text-xs">{p.type}</Badge>
                          {p.isFeatured && <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">مميز</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={p.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-muted text-muted-foreground"}>{p.isActive ? "نشط" : "معطل"}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => setEditingPlatform(p as Platform)} className="text-primary hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={async () => { await deletePlatform.mutateAsync({ id: p.id }); inv([{ queryKey: getListPlatformsQueryKey({}) }]); toast({ title: "تم حذف المنصة" }); }} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                    {editingPlatform?.id === p.id && (
                      <CardContent><PlatformForm initial={p as Partial<Platform>} sections={sections as Section[]} onSave={async (d) => { await updatePlatform.mutateAsync({ id: p.id, data: d as Parameters<typeof updatePlatform.mutateAsync>[0]["data"] }); inv([{ queryKey: getListPlatformsQueryKey({}) }]); setEditingPlatform(null); toast({ title: "تم تحديث المنصة" }); }} onCancel={() => setEditingPlatform(null)} /></CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {activeTab === "news" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-cinzel text-3xl text-primary">الأخبار</h1>
                <Button onClick={() => setAddingNews(true)} className="font-tajawal bg-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> إضافة خبر</Button>
              </div>
              {addingNews && (
                <Card className="bg-card border-primary/30 mb-6">
                  <CardHeader><CardTitle className="font-tajawal text-lg text-primary">خبر جديد</CardTitle></CardHeader>
                  <CardContent><NewsForm onSave={async (d) => { await createNews.mutateAsync({ data: d as Parameters<typeof createNews.mutateAsync>[0]["data"] }); inv([{ queryKey: getListNewsQueryKey({}) }]); setAddingNews(false); toast({ title: "تم إضافة الخبر" }); }} onCancel={() => setAddingNews(false)} /></CardContent>
                </Card>
              )}
              <div className="space-y-3">
                {news?.map((n) => (
                  <Card key={n.id} className="bg-card border-primary/20">
                    <CardContent className="pt-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-tajawal text-foreground font-medium">{n.titleAr || n.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {n.isPinned && <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">مثبت</Badge>}
                          {n.category && <Badge className="bg-secondary/50 text-xs">{n.category}</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={n.isPublished ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-muted text-muted-foreground"}>{n.isPublished ? "منشور" : "مسودة"}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => setEditingNews(n as NewsPost)} className="text-primary hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={async () => { await deleteNews.mutateAsync({ id: n.id }); inv([{ queryKey: getListNewsQueryKey({}) }]); toast({ title: "تم حذف الخبر" }); }} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                    {editingNews?.id === n.id && (
                      <CardContent><NewsForm initial={n as Partial<NewsPost>} onSave={async (d) => { await updateNews.mutateAsync({ id: n.id, data: d as Parameters<typeof updateNews.mutateAsync>[0]["data"] }); inv([{ queryKey: getListNewsQueryKey({}) }]); setEditingNews(null); toast({ title: "تم تحديث الخبر" }); }} onCancel={() => setEditingNews(null)} /></CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Ads */}
          {activeTab === "ads" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-cinzel text-3xl text-primary">الإعلانات</h1>
                <Button onClick={() => setAddingAd(true)} className="font-tajawal bg-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> إضافة إعلان</Button>
              </div>
              {addingAd && (
                <Card className="bg-card border-primary/30 mb-6">
                  <CardHeader><CardTitle className="font-tajawal text-lg text-primary">إعلان جديد</CardTitle></CardHeader>
                  <CardContent><AdForm onSave={async (d) => { await createAd.mutateAsync({ data: d as Parameters<typeof createAd.mutateAsync>[0]["data"] }); inv([{ queryKey: getListAdvertisementsQueryKey({}) }]); setAddingAd(false); toast({ title: "تم إضافة الإعلان" }); }} onCancel={() => setAddingAd(false)} /></CardContent>
                </Card>
              )}
              <div className="space-y-3">
                {ads?.map((a) => (
                  <Card key={a.id} className="bg-card border-primary/20">
                    <CardContent className="pt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-16 h-12 object-cover rounded border border-primary/20" />}
                        <div>
                          <p className="font-tajawal text-foreground font-medium">{a.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">{a.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={a.isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-muted text-muted-foreground"}>{a.isActive ? "نشط" : "معطل"}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => setEditingAd(a as Ad)} className="text-primary hover:text-primary hover:bg-primary/10"><Pencil className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={async () => { await deleteAd.mutateAsync({ id: a.id }); inv([{ queryKey: getListAdvertisementsQueryKey({}) }]); toast({ title: "تم حذف الإعلان" }); }} className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardContent>
                    {editingAd?.id === a.id && (
                      <CardContent><AdForm initial={a as Partial<Ad>} onSave={async (d) => { await updateAd.mutateAsync({ id: a.id, data: d as Parameters<typeof updateAd.mutateAsync>[0]["data"] }); inv([{ queryKey: getListAdvertisementsQueryKey({}) }]); setEditingAd(null); toast({ title: "تم تحديث الإعلان" }); }} onCancel={() => setEditingAd(null)} /></CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div>
              <h1 className="font-cinzel text-3xl text-primary mb-8">الإعدادات</h1>
              <Card className="bg-card border-primary/20">
                <CardContent className="pt-6"><SettingsEditor /></CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
