import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    gam3yaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gam3ya",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    positionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    isForTrade: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Position = mongoose.model("Position", positionSchema);

export default Position;

