import { Router } from "express";
  import { db, siteSettingsTable } from "@workspace/db";
  import { eq } from "drizzle-orm";
  import { UpdateSettingsBody } from "@workspace/api-zod";

  const router = Router();

  async function ensureSettings() {
    const existing = await db.select().from(siteSettingsTable).limit(1);
    if (existing.length === 0) {
      await db.insert(siteSettingsTable).values({});
    }
    const [settings] = await db.select().from(siteSettingsTable).limit(1);
    return settings;
  }

  router.get("/", async (_req, res) => {
    try {
      const settings = await ensureSettings();
      res.json({
        ...settings,
        updatedAt: settings.updatedAt ? settings.updatedAt.toISOString() : null,
      });
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.patch("/", async (req, res) => {
    try {
      const body = UpdateSettingsBody.parse(req.body);
      const settings = await ensureSettings();
      const [updated] = await db
        .update(siteSettingsTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(siteSettingsTable.id, settings.id))
        .returning();
      res.json({
        ...updated,
        updatedAt: updated.updatedAt ? updated.updatedAt.toISOString() : null,
      });
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input", details: err.issues });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  export default router;
  