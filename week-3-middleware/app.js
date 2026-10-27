import express from "express";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import dogsRouter from "./routes/dogs.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 1. Give every request a unique ID
app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

// 2. Log every request
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}]: ${req.method} ${req.path} (${req.requestId})`,
  );
  next();
});

// 3. Add security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// 4. Parse JSON and limit request bodies to 1 MB
app.use(express.json({ limit: "1mb" }));

// 5. Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// 6. Require JSON for adoption requests
app.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/adopt") {
    if (!req.is("application/json")) {
      return res.status(400).json({
        error: "Content-Type must be application/json",
        requestId: req.requestId,
      });
    }
  }

  next();
});

// 7. Register dog routes
app.use("/", dogsRouter);

// 8. Handle routes that do not exist
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    requestId: req.requestId,
  });
});

// 9. Handle errors
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const requestId = req.requestId;

  if (err.name === "ValidationError") {
    console.warn(`WARN: ${err.name}`, requestId);

    return res.status(400).json({
      error: err.message,
      requestId,
    });
  }

  if (err.name === "NotFoundError") {
    console.warn(`WARN: ${err.name}`, requestId);

    return res.status(404).json({
      error: err.message,
      requestId,
    });
  }

  console.error(`ERROR: ${err.name || "Error"}`, requestId);

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      error: "Request body too large",
      requestId,
    });
  }

  return res.status(500).json({
    error: "Internal Server Error",
    requestId,
  });
});

if (!process.env.VITEST) {
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

export default app;
