const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { CORS_ORIGIN, NODE_ENV } = require("./config/env");
const apiRoutes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV !== "test") app.use(morgan("dev"));

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

// Healthcheck (Render)
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// API v1
app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  res.json({ name: "VINCU Backend", status: "running" });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
