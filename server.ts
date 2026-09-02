import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support up to 50MB for image data transfers and base64 payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  const DATA_FILE = path.join(process.cwd(), "src", "data", "savedCustomImages.json");

  // Read saved images from persistent disk file
  function getSavedImages(): Record<string, string> {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading saved images file:", e);
    }
    return {};
  }

  // Persist images to disk file
  function persistImages(images: Record<string, string>) {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing saved images file:", e);
    }
  }

  // API endpoints FIRST
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Get saved custom images
  app.get("/api/custom-images", (_req, res) => {
    const images = getSavedImages();
    res.json({ success: true, images });
  });

  // Update or persist custom images across all devices
  app.post("/api/custom-images", (req, res) => {
    const incoming = req.body?.images;
    if (!incoming || typeof incoming !== "object") {
      res.status(400).json({ error: "Invalid images payload" });
      return;
    }

    const current = getSavedImages();
    const merged = { ...current, ...incoming };
    persistImages(merged);

    res.json({
      success: true,
      count: Object.keys(merged).length,
      images: merged,
    });
  });

  // Reset custom images to default
  app.post("/api/reset-images", (_req, res) => {
    persistImages({});
    res.json({ success: true, message: "Images reset successfully" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NUEVO AUDIO Server running on port ${PORT}`);
  });
}

startServer();
