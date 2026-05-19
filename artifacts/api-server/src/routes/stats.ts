import { Router } from "express";
import { db, sectionsTable, platformsTable, newsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  const [
    sectionRows,
    platformRows,
    newsRows,
  ] = await Promise.all([
    db.select().from(sectionsTable),
    db.select().from(platformsTable),
    db.select().from(newsTable),
  ]);

  const totalSections = sectionRows.length;
  const totalPlatforms = platformRows.length;
  const totalNews = newsRows.length;
  const featuredPlatforms = platformRows.filter((p) => p.isFeatured).length;
  const activePlatforms = platformRows.filter((p) => p.isActive).length;

  const platformsByType: Record<string, number> = {};
  for (const p of platformRows) {
    platformsByType[p.type] = (platformsByType[p.type] || 0) + 1;
  }

  const sectionMap = new Map(sectionRows.map((s) => [s.id, s.name]));
  const sectionCounts = new Map<number, number>();
  for (const p of platformRows) {
    sectionCounts.set(p.sectionId, (sectionCounts.get(p.sectionId) || 0) + 1);
  }

  const platformsBySection = Array.from(sectionCounts.entries()).map(([sectionId, count]) => ({
    sectionId,
    sectionName: sectionMap.get(sectionId) || "Unknown",
    count,
  }));

  res.json({
    totalSections,
    totalPlatforms,
    totalNews,
    featuredPlatforms,
    activePlatforms,
    platformsByType,
    platformsBySection,
  });
});

export default router;
