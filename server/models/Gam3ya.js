import mongoose from "mongoose";

const gam3yaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    monthlyAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    maxMembers: {
      type: Number,
      required: true,
      min: 1,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Gam3ya = mongoose.model("Gam3ya", gam3yaSchema);

export default Gam3ya;

