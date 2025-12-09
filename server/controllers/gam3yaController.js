import Gam3ya from "../models/Gam3ya.js";

export const createGam3ya = async (req, res) => {
  try {
    const gam3ya = await Gam3ya.create(req.body);
    res.status(201).json({ message: "Gam3ya created", gam3ya });
  } catch (error) {
    res.status(500).json({ message: "Failed to create gam3ya", error: error.message });
  }
};

export const getGam3yas = async (_req, res) => {
  try {
    const gam3yas = await Gam3ya.find().populate("members", "username email");
    res.status(200).json({ gam3yas });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gam3yas", error: error.message });
  }
};

export const getGam3yaById = async (req, res) => {
  try {
    const gam3ya = await Gam3ya.findById(req.params.id).populate("members", "username email");
    if (!gam3ya) {
      return res.status(404).json({ message: "Gam3ya not found" });
    }
    res.status(200).json({ gam3ya });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gam3ya", error: error.message });
  }
};

export const updateGam3ya = async (req, res) => {
  try {
    const gam3ya = await Gam3ya.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!gam3ya) {
      return res.status(404).json({ message: "Gam3ya not found" });
    }
    res.status(200).json({ message: "Gam3ya updated", gam3ya });
  } catch (error) {
    res.status(500).json({ message: "Failed to update gam3ya", error: error.message });
  }
};

export const deleteGam3ya = async (req, res) => {
  try {
    const gam3ya = await Gam3ya.findByIdAndDelete(req.params.id);
    if (!gam3ya) {
      return res.status(404).json({ message: "Gam3ya not found" });
    }
    res.status(200).json({ message: "Gam3ya deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete gam3ya", error: error.message });
  }
};

export const joinGam3ya = async (req, res) => {
  try {
    const { userId } = req.body;
    const gam3ya = await Gam3ya.findById(req.params.id);

    if (!gam3ya) {
      return res.status(404).json({ message: "Gam3ya not found" });
    }

    if (gam3ya.members.length >= gam3ya.maxMembers) {
      return res.status(400).json({ message: "Gam3ya is full" });
    }

    if (gam3ya.members.includes(userId)) {
      return res.status(400).json({ message: "User already in gam3ya" });
    }

    gam3ya.members.push(userId);
    await gam3ya.save();

    res.status(200).json({ message: "Joined gam3ya", gam3ya });
  } catch (error) {
    res.status(500).json({ message: "Failed to join gam3ya", error: error.message });
  }
};

