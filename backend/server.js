import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import { app, server } from "./socket/socket.js";

import { MongoMemoryServer } from "mongodb-memory-server";

// ── Force load .env from the exact directory of server.js ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicit path - this fixes most OneDrive / working-dir issues on Windows
const envResult = dotenv.config({ path: path.join(__dirname, '.env') });

if (envResult.error) {
  console.error("Failed to load .env file:", envResult.error.message);
} else {
  console.log(".env file loaded successfully from:", path.join(__dirname, '.env'));
}

// Debug: show what was actually loaded
console.log("MONGO_DB_URI after load:", process.env.MONGO_DB_URI || "NOT FOUND");
console.log("PORT after load:", process.env.PORT || "NOT FOUND");

const PORT = process.env.PORT || 5000;

// ── MongoDB Connection with retry + in-memory fallback ──
let mongodInstance = null;

const startInMemoryMongo = async () => {
  try {
    console.log("Starting in-memory MongoDB server...");
    mongodInstance = await MongoMemoryServer.create();
    const memUri = mongodInstance.getUri();
    console.log("In-memory MongoDB started at", memUri);
    await mongoose.connect(memUri);
    console.log("Connected to in-memory MongoDB");
  } catch (err) {
    console.error("Failed to start in-memory MongoDB:", err?.message || err);
  }
};

const connectWithRetry = async (uri, attempts = 5, delayMs = 1000) => {
  for (let i = 1; i <= attempts; i++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("MongoDB Connected");
      return;
    } catch (err) {
      console.error(`MongoDB Connection Attempt ${i} failed:`, err?.message || err);
      if (i < attempts) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        console.error("All attempts failed. Falling back to in-memory MongoDB...");
        await startInMemoryMongo();
      }
    }
  }
};

// Start DB connection
const MONGO_URI = process.env.MONGO_DB_URI;
if (!MONGO_URI) {
  console.error("MONGO_DB_URI is not defined after loading .env!");
  console.error("Please check:");
  console.error("1. File is named exactly .env (no .txt, no extra dots)");
  console.error("2. No spaces around = signs");
  console.error("3. Try moving project outside OneDrive folder");
  process.exit(1);
}

connectWithRetry(MONGO_URI);

// Graceful shutdown for in-memory mongo
process.on("SIGINT", async () => {
  try {
    if (mongodInstance) {
      await mongodInstance.stop();
      console.log("Stopped in-memory MongoDB");
    }
    process.exit(0);
  } catch (e) {
    console.error("Error during shutdown:", e);
    process.exit(1);
  }
});

// ── Middleware ──
app.use(express.json());
app.use(cookieParser());

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ── Serve frontend static files ──
const frontendDistPath = path.join(__dirname, "../frontend/dist"); // adjust if your frontend is elsewhere

app.use(express.static(frontendDistPath));

// Catch-all route → serve index.html for SPA routing
app.get("*", (req, res) => {
  const indexPath = path.join(frontendDistPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.warn("Could not serve index.html:", err.message);
      res.status(404).json({ message: "Not Found" });
    }
  });
});

// ── Start server with port retry ──
const startServer = (port) => {
  const s = server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  s.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} in use. Trying ${port + 1}...`);
      setTimeout(() => startServer(port + 1), 1000);
    } else {
      console.error("Server start error:", err);
      process.exit(1);
    }
  });
};

startServer(PORT);