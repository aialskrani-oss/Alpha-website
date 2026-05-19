import { Router } from "express";
import { db, newsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import {
  CreateNewsPostBody,
  UpdateNewsPostBody,
  GetNewsPostParams,
  UpdateNewsPostParams,
  DeleteNewsPostParams,
  ListNewsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const query = ListNewsQueryParams.parse({
    pinned: req.query.pinned !== undefined ? req.query.pinned === "true" : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
  });

  const conditions = [];
  if (query.pinned !== undefined) conditions.push(eq(newsTable.isPinned, query.pinned));

  let q = db.select().from(newsTable);
  const results = conditions.length > 0
    ? await db.select().from(newsTable).where(and(...conditions)).orderBy(desc(newsTable.createdAt))
    : await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));

  const limited = query.limit ? results.slice(0, query.limit) : results;
  res.json(limited.map((n) => ({
    ...n,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt ? n.updatedAt.toISOString() : null,
  })));
});

router.post("/", async (req, res) => {
  const body = CreateNewsPostBody.parse(req.body);
  const [post] = await db.insert(newsTable).values({
    title: body.title,
    titleAr: body.titleAr ?? null,
    slug: body.slug,
    content: body.content ?? null,
    contentAr: body.contentAr ?? null,
    excerpt: body.excerpt ?? null,
    imageUrl: body.imageUrl ?? null,
    isPinned: body.isPinned ?? false,
    isPublished: body.isPublished ?? true,
    category: body.category ?? null,
  }).returning();
  res.status(201).json({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = GetNewsPostParams.parse({ id: parseInt(req.params.id) });
  const [post] = await db.select().from(newsTable).where(eq(newsTable.id, id));
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
  });
});

router.patch("/:id", async (req, res) => {
  const { id } = UpdateNewsPostParams.parse({ id: parseInt(req.params.id) });
  const body = UpdateNewsPostBody.parse(req.body);
  const [post] = await db.update(newsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(newsTable.id, id))
    .returning();
  if (!post) return res.status(404).json({ error: "Not found" });
  res.json({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = DeleteNewsPostParams.parse({ id: parseInt(req.params.id) });
  await db.delete(newsTable).where(eq(newsTable.id, id));
  res.status(204).send();
});

export default router;
