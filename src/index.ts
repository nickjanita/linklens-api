import express from "express";
import { analyzeLink } from "./utils/linkAnalyzer";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/analyze-link", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing URL in request body" });
  }

  const result = analyzeLink(url);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🔍 LinkLens API is running on http://localhost:${PORT}`);
});
