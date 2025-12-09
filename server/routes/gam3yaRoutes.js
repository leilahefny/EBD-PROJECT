import express from "express";
import {
  createGam3ya,
  deleteGam3ya,
  getGam3yaById,
  getGam3yas,
  joinGam3ya,
  updateGam3ya,
} from "../controllers/gam3yaController.js";

const router = express.Router();

router.post("/", createGam3ya);
router.get("/", getGam3yas);
router.get("/:id", getGam3yaById);
router.put("/:id", updateGam3ya);
router.delete("/:id", deleteGam3ya);
router.post("/:id/join", joinGam3ya);

export default router;

