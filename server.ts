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
  const CONFIG_FILE = path.join(process.cwd(), "src", "data", "supabaseConfig.json");

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

  function getSupabaseServerConfig() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading supabase config file:", e);
    }
    return {
      url: process.env.VITE_SUPABASE_URL || "",
      anonKey: process.env.VITE_SUPABASE_ANON_KEY || "",
    };
  }

  function persistSupabaseServerConfig(config: { url: string; anonKey: string }) {
    try {
      const dir = path.dirname(CONFIG_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
    } catch (e) {
      console.error("Error writing supabase config file:", e);
    }
  }

  // API endpoints FIRST
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Get shared Supabase credentials across all devices
  app.get("/api/supabase-config", (_req, res) => {
    const config = getSupabaseServerConfig();
    res.json({ success: true, config });
  });

  // Save shared Supabase credentials across all devices
  app.post("/api/supabase-config", (req, res) => {
    const { url, anonKey } = req.body || {};
    if (url && anonKey) {
      persistSupabaseServerConfig({ url, anonKey });
    }
    res.json({ success: true });
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
