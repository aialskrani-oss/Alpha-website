import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sectionsRouter from "./sections";
import platformsRouter from "./platforms";
import newsRouter from "./news";
import advertisementsRouter from "./advertisements";
import settingsRouter from "./settings";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/sections", sectionsRouter);
router.use("/platforms", platformsRouter);
router.use("/news", newsRouter);
router.use("/advertisements", advertisementsRouter);
router.use("/settings", settingsRouter);
router.use("/stats", statsRouter);

export default router;
