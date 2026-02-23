import express from "express";
import apiRouter from "./router";
import { buildOpenApiDocument } from "./swagger";

const app = express();
const allowedOrigins = (
  process.env.CORS_ALLOWED_ORIGINS ||
  "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// use JSON for req.body
app.use(express.json());

// use the router to answers request on /api
app.use("/api", apiRouter);

app.get("/openapi.json", (_, res) => {
  res.json(buildOpenApiDocument());
});

// return HTTP 404 if the request has not been handled
app.use((_, res) => {
  res.status(404).send();
});

export default app;
