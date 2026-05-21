import express from "express";
import cors from "cors";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { eq, asc } from "drizzle-orm";

const { Pool } = pg;

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sectionsTable = pgTable("sections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull().default("folder"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const platformsTable = pgTable("platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  type: text("type").notNull().default("telegram_bot"),
  url: text("url"),
  imageUrl: text("image_url"),
  sectionId: integer("section_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  tags: text("tags"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const newsPostsTable = pgTable("news_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  contentAr: text("content_ar"),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  isPinned: boolean("is_pinned").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
});

const advertisementsTable = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  position: text("position").default("banner"),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const siteSettingsTable = pgTable("site_settings", {
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

const db = drizzle(pool, {
  schema: { sectionsTable, platformsTable, newsPostsTable, advertisementsTable, siteSettingsTable },
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));

app.get("/api/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.patch("/api/settings", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable).limit(1);
    if (!rows[0]) {
      const created = await db.insert(siteSettingsTable).values(req.body).returning();
      return res.json(created[0]);
    }
    const updated = await db.update(siteSettingsTable).set(req.body).where(eq(siteSettingsTable.id, rows[0].id)).returning();
    res.json(updated[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/sections", async (_req, res) => {
  try {
    const rows = await db.select().from(sectionsTable).orderBy(asc(sectionsTable.order));
    res.json(rows);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/sections", async (req, res) => {
  try {
    const row = await db.insert(sectionsTable).values(req.body).returning();
    res.status(201).json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/sections/by-slug/:slug", async (req, res) => {
  try {
    const row = await db.select().from(sectionsTable).where(eq(sectionsTable.slug, req.params.slug)).limit(1);
    if (!row[0]) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/sections/:id", async (req, res) => {
  try {
    const row = await db.select().from(sectionsTable).where(eq(sectionsTable.id, Number(req.params.id))).limit(1);
    if (!row[0]) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.put("/api/sections/:id", async (req, res) => {
  try {
    const row = await db.update(sectionsTable).set(req.body).where(eq(sectionsTable.id, Number(req.params.id))).returning();
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.delete("/api/sections/:id", async (req, res) => {
  try {
    await db.delete(sectionsTable).where(eq(sectionsTable.id, Number(req.params.id)));
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/platforms", async (req, res) => {
  try {
    let query = db.select().from(platformsTable).$dynamic();
    if (req.query.sectionId) query = query.where(eq(platformsTable.sectionId, Number(req.query.sectionId))) as typeof query;
    if (req.query.featured === "true") query = query.where(eq(platformsTable.isFeatured, true)) as typeof query;
    const rows = await query.orderBy(asc(platformsTable.order));
    res.json(rows);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/platforms", async (req, res) => {
  try {
    const row = await db.insert(platformsTable).values(req.body).returning();
    res.status(201).json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/platforms/:id", async (req, res) => {
  try {
    const row = await db.select().from(platformsTable).where(eq(platformsTable.id, Number(req.params.id))).limit(1);
    if (!row[0]) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.put("/api/platforms/:id", async (req, res) => {
  try {
    const row = await db.update(platformsTable).set(req.body).where(eq(platformsTable.id, Number(req.params.id))).returning();
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.delete("/api/platforms/:id", async (req, res) => {
  try {
    await db.delete(platformsTable).where(eq(platformsTable.id, Number(req.params.id)));
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/news", async (req, res) => {
  try {
    let rows = await db.select().from(newsPostsTable).orderBy(asc(newsPostsTable.createdAt));
    if (req.query.published === "true") rows = rows.filter((n) => n.isPublished);
    if (req.query.limit) rows = rows.slice(0, Number(req.query.limit));
    res.json(rows.reverse());
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/news", async (req, res) => {
  try {
    const row = await db.insert(newsPostsTable).values(req.body).returning();
    res.status(201).json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/news/by-slug/:slug", async (req, res) => {
  try {
    const row = await db.select().from(newsPostsTable).where(eq(newsPostsTable.slug, req.params.slug)).limit(1);
    if (!row[0]) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/news/:id", async (req, res) => {
  try {
    const row = await db.select().from(newsPostsTable).where(eq(newsPostsTable.id, Number(req.params.id))).limit(1);
    if (!row[0]) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.put("/api/news/:id", async (req, res) => {
  try {
    const row = await db.update(newsPostsTable).set(req.body).where(eq(newsPostsTable.id, Number(req.params.id))).returning();
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.delete("/api/news/:id", async (req, res) => {
  try {
    await db.delete(newsPostsTable).where(eq(newsPostsTable.id, Number(req.params.id)));
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/advertisements", async (req, res) => {
  try {
    let rows = await db.select().from(advertisementsTable).orderBy(asc(advertisementsTable.order));
    if (req.query.active === "true") rows = rows.filter((a) => a.isActive);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.post("/api/advertisements", async (req, res) => {
  try {
    const row = await db.insert(advertisementsTable).values(req.body).returning();
    res.status(201).json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.put("/api/advertisements/:id", async (req, res) => {
  try {
    const row = await db.update(advertisementsTable).set(req.body).where(eq(advertisementsTable.id, Number(req.params.id))).returning();
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.delete("/api/advertisements/:id", async (req, res) => {
  try {
    await db.delete(advertisementsTable).where(eq(advertisementsTable.id, Number(req.params.id)));
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/stats", async (_req, res) => {
  try {
    const [sections, platforms, news, featured, active] = await Promise.all([
      db.select().from(sectionsTable),
      db.select().from(platformsTable),
      db.select().from(newsPostsTable),
      db.select().from(platformsTable).where(eq(platformsTable.isFeatured, true)),
      db.select().from(platformsTable).where(eq(platformsTable.isActive, true)),
    ]);
    const bySection = sections.map((s) => ({
      sectionId: s.id,
      sectionName: s.nameAr || s.name,
      count: platforms.filter((p) => p.sectionId === s.id).length,
    }));
    res.json({
      totalSections: sections.length,
      totalPlatforms: platforms.length,
      totalNews: news.length,
      featuredPlatforms: featured.length,
      activePlatforms: active.length,
      platformsBySection: bySection,
    });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

export default app;
