import express from "express";
import cors from "cors";
import { db } from "@workspace/db";
import {
  sectionsTable,
  platformsTable,
  newsPostsTable,
  advertisementsTable,
  siteSettingsTable,
} from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health ──
app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));

// ── Settings ──
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

// ── Sections ──
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

app.get("/api/sections/:id", async (req, res) => {
  try {
    const row = await db.select().from(sectionsTable).where(eq(sectionsTable.id, Number(req.params.id))).limit(1);
    if (!row[0]) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/api/sections/by-slug/:slug", async (req, res) => {
  try {
    const row = await db.select().from(sectionsTable).where(eq(sectionsTable.slug, req.params.slug)).limit(1);
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

// ── Platforms ──
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

// ── News ──
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

// ── Advertisements ──
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

// ── Stats ──
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
