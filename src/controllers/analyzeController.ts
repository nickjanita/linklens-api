import { Request, Response } from "express";
import { analyzeLink } from "../services/linkAnalyzer";

export async function analyzeLinkController(req: Request, res: Response) {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: "Missing URL in request body" });
    return;
  }

  try {
    const result = await analyzeLink(url);
    res.status(200).json(result);
    return;
  } catch (err) {
    res.status(500).json({ error: "Link analysis failed", details: err });
    return;
  }
}
