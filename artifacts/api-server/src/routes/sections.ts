import { Router } from "express";
  import { db, sectionsTable } from "@workspace/db";
  import { eq } from "drizzle-orm";
  import {
    CreateSectionBody,
    UpdateSectionBody,
    GetSectionParams,
    UpdateSectionParams,
    DeleteSectionParams,
  } from "@workspace/api-zod";

  const router = Router();

  router.get("/", async (req, res) => {
    try {
      const sections = await db.select().from(sectionsTable).orderBy(sectionsTable.order);
      res.json(sections.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() })));
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const body = CreateSectionBody.parse(req.body);
      const [section] = await db.insert(sectionsTable).values({
        name: body.name,
        nameAr: body.nameAr ?? null,
        slug: body.slug,
        icon: body.icon,
        description: body.description ?? null,
        descriptionAr: body.descriptionAr ?? null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      }).returning();
      res.status(201).json({ ...section, createdAt: section.createdAt.toISOString() });
    } catch (err: any) {
      if (err?.code === "23505") return res.status(409).json({ error: "Slug already exists" });
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input", details: err.issues });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = GetSectionParams.parse({ id: parseInt(req.params.id) });
      const [section] = await db.select().from(sectionsTable).where(eq(sectionsTable.id, id));
      if (!section) return res.status(404).json({ error: "Not found" });
      res.json({ ...section, createdAt: section.createdAt.toISOString() });
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input" });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const { id } = UpdateSectionParams.parse({ id: parseInt(req.params.id) });
      const body = UpdateSectionBody.parse(req.body);
      const [section] = await db.update(sectionsTable).set(body).where(eq(sectionsTable.id, id)).returning();
      if (!section) return res.status(404).json({ error: "Not found" });
      res.json({ ...section, createdAt: section.createdAt.toISOString() });
    } catch (err: any) {
      if (err?.code === "23505") return res.status(409).json({ error: "Slug already exists" });
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input" });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const { id } = DeleteSectionParams.parse({ id: parseInt(req.params.id) });
      await db.delete(sectionsTable).where(eq(sectionsTable.id, id));
      res.status(204).send();
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Invalid input" });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  export default router;
  