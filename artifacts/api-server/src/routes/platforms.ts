import { Router } from "express";
  import { db, platformsTable } from "@workspace/db";
  import { eq, and } from "drizzle-orm";
  import {
    CreatePlatformBody,
    UpdatePlatformBody,
    GetPlatformParams,
    UpdatePlatformParams,
    DeletePlatformParams,
    ListPlatformsQueryParams,
  } from "@workspace/api-zod";

  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const query = ListPlatformsQueryParams.parse({
        sectionId: req.query.sectionId ? parseInt(req.query.sectionId as string) : undefined,
        featured: req.query.featured !== undefined ? req.query.featured === "true" : undefined,
      });

      const conditions = [];
      if (query.sectionId !== undefined) conditions.push(eq(platformsTable.sectionId, query.sectionId));
      if (query.featured !== undefined) conditions.push(eq(platformsTable.isFeatured, query.featured));

      const platforms = conditions.length > 0
        ? await db.select().from(platformsTable).where(and(...conditions)).orderBy(platformsTable.order)
        : await db.select().from(platformsTable).orderBy(platformsTable.order);

      res.json(platforms.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() })));
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const body = CreatePlatformBody.parse(req.body);
      const [platform] = await db.insert(platformsTable).values({
        name: body.name,
        nameAr: body.nameAr ?? null,
        slug: body.slug,
        description: body.description ?? null,
        descriptionAr: body.descriptionAr ?? null,
        type: body.type,
        url: body.url ?? null,
        imageUrl: body.imageUrl ?? null,
        sectionId: body.sectionId,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
        order: body.order ?? 0,
        tags: body.tags ?? null,
      }).returning();
      res.status(201).json({ ...platform, createdAt: platform.createdAt.toISOString() });
    } catch (err: any) {
      if (err?.code === "23505") return res.status(409).json({ error: "Slug already exists" });
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input", details: err.issues });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = GetPlatformParams.parse({ id: parseInt(req.params.id) });
      const [platform] = await db.select().from(platformsTable).where(eq(platformsTable.id, id));
      if (!platform) return res.status(404).json({ error: "Not found" });
      res.json({ ...platform, createdAt: platform.createdAt.toISOString() });
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input" });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const { id } = UpdatePlatformParams.parse({ id: parseInt(req.params.id) });
      const body = UpdatePlatformBody.parse(req.body);
      const [platform] = await db.update(platformsTable).set(body).where(eq(platformsTable.id, id)).returning();
      if (!platform) return res.status(404).json({ error: "Not found" });
      res.json({ ...platform, createdAt: platform.createdAt.toISOString() });
    } catch (err: any) {
      if (err?.code === "23505") return res.status(409).json({ error: "Slug already exists" });
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input" });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = DeletePlatformParams.parse({ id: parseInt(req.params.id) });
      await db.delete(platformsTable).where(eq(platformsTable.id, id));
      res.status(204).send();
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input" });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  export default router;
  