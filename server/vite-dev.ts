// server/vite-dev.ts
import { type Express } from "express";
import { type Server as HTTPServer } from "http";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { nanoid } from "nanoid";

export async function setupVite(app: Express, server: HTTPServer) {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: { server }, allowHost: "localhost" },
    appType: "custom",
  });
  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const htmlPath = path.resolve(__dirname, "../client/index.html");
      let html = await fs.promises.readFile(htmlPath, "utf-8");
      html = html.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      const page = await vite.transformIndexHtml(req.originalUrl, html);
      res.status(200).type("text/html").send(page);
    } catch (err) {
      vite.ssrFixStacktrace(err as Error);
      next(err);
    }
  });
}

