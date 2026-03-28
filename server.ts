import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple file-based database for mock data
const DB_FILE = path.join(process.cwd(), "mock-db.json");

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      if (content.trim()) {
        return JSON.parse(content);
      }
    }
  } catch (e) {
    console.error("Failed to load DB, using defaults", e);
  }
  return { spaces: [], dishes: [], orders: [] };
}

function saveDb(data: any) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));
    fs.renameSync(tempFile, DB_FILE);
  } catch (e) {
    console.error("Failed to save DB", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Load initial data
  const db = loadDb();

  // API Routes
  app.get("/api/spaces/:id", (req, res) => {
    const space = db.spaces.find((s: any) => s.id === req.params.id);
    res.json(space || null);
  });

  app.post("/api/spaces", (req, res) => {
    const newSpace = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: req.body.name || "我们的空间",
      createdAt: new Date().toISOString()
    };
    db.spaces.push(newSpace);
    saveDb(db);
    res.json(newSpace);
  });

  app.get("/api/dishes", (req, res) => {
    const spaceId = req.query.spaceId;
    const filteredDishes = db.dishes.filter((d: any) => d.spaceId === spaceId);
    res.json(filteredDishes);
  });

  app.post("/api/dishes", (req, res) => {
    const newDish = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    db.dishes.push(newDish);
    saveDb(db);
    res.json(newDish);
  });

  app.put("/api/dishes/:id", (req, res) => {
    const index = db.dishes.findIndex((d: any) => d.id === req.params.id);
    if (index !== -1) {
      db.dishes[index] = { ...db.dishes[index], ...req.body };
      saveDb(db);
      res.json(db.dishes[index]);
    } else {
      res.status(404).json({ error: "Dish not found" });
    }
  });

  app.delete("/api/dishes/:id", (req, res) => {
    const index = db.dishes.findIndex((d: any) => d.id === req.params.id);
    if (index !== -1) {
      db.dishes.splice(index, 1);
      saveDb(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Dish not found" });
    }
  });

  app.get("/api/orders", (req, res) => {
    const spaceId = req.query.spaceId;
    const filteredOrders = db.orders.filter((o: any) => o.spaceId === spaceId);
    res.json(filteredOrders);
  });

  app.post("/api/orders", (req, res) => {
    const newOrder = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    saveDb(db);
    res.json(newOrder);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
