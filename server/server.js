import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import gam3yaRoutes from "./routes/gam3yaRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ message: "Gama3li Shokran API running" });
});

app.use("/api/users", userRoutes);
app.use("/api/gam3ya", gam3yaRoutes);
app.use("/api/positions", positionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

