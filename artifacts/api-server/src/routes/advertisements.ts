import { Router } from "express";
  import { db, advertisementsTable } from "@workspace/db";
  import { eq } from "drizzle-orm";
  import {
    CreateAdvertisementBody,
    UpdateAdvertisementBody,
    UpdateAdvertisementParams,
    DeleteAdvertisementParams,
    ListAdvertisementsQueryParams,
  } from "@workspace/api-zod";

  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const query = ListAdvertisementsQueryParams.parse({
        active: req.query.active !== undefined ? req.query.active === "true" : undefined,
      });

      const ads = query.active !== undefined
        ? await db.select().from(advertisementsTable).where(eq(advertisementsTable.isActive, query.active)).orderBy(advertisementsTable.order)
        : await db.select().from(advertisementsTable).orderBy(advertisementsTable.order);

      res.json(ads.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() })));
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const body = CreateAdvertisementBody.parse(req.body);
      const [ad] = await db.insert(advertisementsTable).values({
        title: body.title,
        imageUrl: body.imageUrl ?? null,
        linkUrl: body.linkUrl ?? null,
        position: body.position ?? "banner",
        isActive: body.isActive ?? true,
        order: body.order ?? 0,
      }).returning();
      res.status(201).json({ ...ad, createdAt: ad.createdAt.toISOString() });
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input", details: err.issues });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const { id } = UpdateAdvertisementParams.parse({ id: parseInt(req.params.id) });
      const body = UpdateAdvertisementBody.parse(req.body);
      const [ad] = await db.update(advertisementsTable).set(body).where(eq(advertisementsTable.id, id)).returning();
      if (!ad) return res.status(404).json({ error: "Not found" });
      res.json({ ...ad, createdAt: ad.createdAt.toISOString() });
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input" });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = DeleteAdvertisementParams.parse({ id: parseInt(req.params.id) });
      await db.delete(advertisementsTable).where(eq(advertisementsTable.id, id));
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  export default router;
  