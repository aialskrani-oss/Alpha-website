import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("Alpha Platform"),
  siteNameAr: text("site_name_ar").default("منصة ألفا"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: text("primary_color").default("#D4AF37"),
  secondaryColor: text("secondary_color").default("#1a2744"),
  accentColor: text("accent_color").default("#F5C842"),
  heroTitle: text("hero_title").default("Alpha Platform"),
  heroTitleAr: text("hero_title_ar").default("منصة ألفا"),
  heroSubtitle: text("hero_subtitle").default("Your gateway to technology and knowledge"),
  heroSubtitleAr: text("hero_subtitle_ar").default("بوابتك نحو التقنية والمعرفة"),
  sumerianText: text("sumerian_text").default("𒀭 𒂗 𒈬 𒄑 𒅆 𒊏 𒁾"),
  footerText: text("footer_text").default("Alpha Platform — All rights reserved"),
  footerTextAr: text("footer_text_ar").default("منصة ألفا — جميع الحقوق محفوظة"),
  socialTelegram: text("social_telegram"),
  socialTwitter: text("social_twitter"),
  socialYoutube: text("social_youtube"),
  socialInstagram: text("social_instagram"),
  socialFacebook: text("social_facebook"),
  socialWhatsapp: text("social_whatsapp"),
  socialTiktok: text("social_tiktok"),
  contactAddress: text("contact_address"),
  contactAddressAr: text("contact_address_ar"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  adminPassword: text("admin_password").default("alpha2024"),
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettingsTable).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettingsTable.$inferSelect;
