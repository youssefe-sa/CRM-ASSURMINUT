// server/vite-prod.ts
import { type Express } from "express";
import path from "path";

export function serveStatic(app: Express) {
  const dist = path.resolve(__dirname, "../client/dist");
  app.use(express.static(dist));
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(dist, "index.html"));
  });
}

