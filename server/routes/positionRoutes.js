import express from "express";
import {
  buyPosition,
  createPosition,
  deletePosition,
  getPositionById,
  getPositions,
  listPositionForTrade,
  listPositionsForTrade,
  swapPositions,
  updatePosition,
} from "../controllers/positionController.js";

const router = express.Router();

router.post("/", createPosition);
router.get("/", getPositions);
router.get("/trade", listPositionsForTrade);
router.get("/:id", getPositionById);
router.put("/:id", updatePosition);
router.delete("/:id", deletePosition);
router.post("/:id/list", listPositionForTrade);
router.post("/:id/buy", buyPosition);
router.post("/swap", swapPositions);

export default router;

