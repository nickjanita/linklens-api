import express from "express";
import analyzeRoutes from "./routes/analyze";

const app = express();
const PORT = 3000;

app.use(express.json());

// Use the modular router
app.use("/", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`LinkLens API running at http://localhost:${PORT}`);
});
