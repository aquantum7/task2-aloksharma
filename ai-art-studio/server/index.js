import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { generateImages } from "./services/imageProvider.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: "32kb" }));

const ALLOWED_RATIOS = new Set(["1:1", "16:9", "9:16", "4:3"]);
const ALLOWED_RESOLUTIONS = new Set(["1024"]);
const MIN_COUNT = 1;
const MAX_COUNT = 4;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ai-art-studio-api" });
});

app.post("/api/images/generate", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1", resolution = "1024", count = 1 } = req.body ?? {};

    if (typeof prompt !== "string" || prompt.trim().length < 3) {
      return res.status(400).json({ error: "Prompt must contain at least 3 characters." });
    }

    if (prompt.trim().length > 2000) {
      return res.status(400).json({ error: "Prompt must be 2000 characters or fewer." });
    }

    if (!ALLOWED_RATIOS.has(aspectRatio)) {
      return res.status(400).json({ error: "Unsupported aspect ratio." });
    }

    if (!ALLOWED_RESOLUTIONS.has(String(resolution))) {
      return res.status(400).json({ error: "Unsupported resolution." });
    }

    const numericCount = Number(count);
    if (!Number.isInteger(numericCount) || numericCount < MIN_COUNT || numericCount > MAX_COUNT) {
      return res.status(400).json({ error: "Generation count must be between 1 and 4." });
    }

    const images = await generateImages({
      prompt: prompt.trim(),
      aspectRatio,
      resolution: String(resolution),
      count: numericCount
    });

    return res.json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    return res.status(500).json({
      error: error?.message || "Image generation failed. Please try again."
    });
  }
});

app.listen(port, () => {
  console.log(`AI Art Studio API running on http://localhost:${port}`);
});
