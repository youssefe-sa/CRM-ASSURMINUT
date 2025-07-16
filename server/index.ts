// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/attached_assets", express.static("attached_assets"));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJson: Record<string, any> | undefined;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    capturedJson = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      let msg = `${req.method} ${path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (capturedJson) msg += ` :: ${JSON.stringify(capturedJson)}`;
      console.log(msg.length > 80 ? `${msg.slice(0, 79)}…` : msg);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
    throw err;
  });

  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite-dev.js");
    await setupVite(app, server);
  } else {
    const { serveStatic } = await import("./vite-prod.js");
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  });
})();
