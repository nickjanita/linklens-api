import { Router } from "express";
import { analyzeLinkController } from "../controllers/analyzeController";

const router = Router();

router.post("/analyze-link", analyzeLinkController);

export default router;
