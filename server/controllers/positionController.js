import Position from "../models/Position.js";
import User from "../models/User.js";

export const createPosition = async (req, res) => {
  try {
    const position = await Position.create(req.body);
    res.status(201).json({ message: "Position created", position });
  } catch (error) {
    res.status(500).json({ message: "Failed to create position", error: error.message });
  }
};

export const getPositions = async (_req, res) => {
  try {
    const positions = await Position.find().populate("gam3yaId").populate("userId", "username email");
    res.status(200).json({ positions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch positions", error: error.message });
  }
};

export const getPositionById = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id)
      .populate("gam3yaId")
      .populate("userId", "username email");
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    res.status(200).json({ position });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch position", error: error.message });
  }
};

export const updatePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    res.status(200).json({ message: "Position updated", position });
  } catch (error) {
    res.status(500).json({ message: "Failed to update position", error: error.message });
  }
};

export const deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    res.status(200).json({ message: "Position deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete position", error: error.message });
  }
};

export const listPositionsForTrade = async (_req, res) => {
  try {
    const positions = await Position.find({ isForTrade: true })
      .populate("gam3yaId")
      .populate("userId", "username email");
    res.status(200).json({ positions });
  } catch (error) {
    res.status(500).json({ message: "Failed to list positions for trade", error: error.message });
  }
};

export const listPositionForTrade = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { isForTrade: true },
      { new: true }
    );
    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    res.status(200).json({ message: "Position listed for trade", position });
  } catch (error) {
    res.status(500).json({ message: "Failed to list position", error: error.message });
  }
};

export const buyPosition = async (req, res) => {
  try {
    const { newUserId } = req.body;
    
    if (!newUserId) {
      return res.status(400).json({ message: "newUserId is required" });
    }

    // Verify new user exists
    const newUser = await User.findById(newUserId);
    if (!newUser) {
      return res.status(404).json({ message: "New user not found" });
    }

    const position = await Position.findById(req.params.id)
      .populate("userId", "username email")
      .populate("gam3yaId", "name");

    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    if (!position.userId) {
      return res.status(400).json({ message: "Position has no current owner" });
    }

    // Store previous owner information before updating
    const previousOwnerId = position.userId._id 
      ? position.userId._id.toString() 
      : (position.userId.toString ? position.userId.toString() : position.userId);
    
    const previousOwner = {
      userId: previousOwnerId,
      username: position.userId?.username || null,
      email: position.userId?.email || null,
    };

    // Store position details
    const positionDetails = {
      positionId: position._id,
      positionNumber: position.positionNumber,
      gam3yaId: position.gam3yaId?._id 
        ? position.gam3yaId._id.toString() 
        : (position.gam3yaId?.toString ? position.gam3yaId.toString() : position.gam3yaId),
      gam3yaName: position.gam3yaId?.name || null,
    };

    // Update to new owner
    position.userId = newUserId;
    position.isForTrade = false;
    await position.save();

    // Populate new owner information
    await position.populate("userId", "username email");

    const newOwner = {
      userId: position.userId?._id 
        ? position.userId._id.toString() 
        : (position.userId?.toString ? position.userId.toString() : position.userId),
      username: position.userId?.username || null,
      email: position.userId?.email || null,
    };

    res.status(200).json({
      message: "Position purchased",
      position: position.toObject(),
      transactionDetails: {
        position: positionDetails,
        previousOwner,
        newOwner,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to buy position", error: error.message });
  }
};

export const swapPositions = async (req, res) => {
  try {
    const { position1Id, position2Id } = req.body;

    // Find both positions with populated user info
    const position1 = await Position.findById(position1Id)
      .populate("userId", "username email")
      .populate("gam3yaId", "name");
    const position2 = await Position.findById(position2Id)
      .populate("userId", "username email")
      .populate("gam3yaId", "name");

    if (!position1) {
      return res.status(404).json({ message: "Position 1 not found" });
    }
    if (!position2) {
      return res.status(404).json({ message: "Position 2 not found" });
    }

    // Store original owners
    const position1OriginalOwner = {
      userId: position1.userId._id || position1.userId,
      username: position1.userId?.username || null,
      email: position1.userId?.email || null,
    };
    const position2OriginalOwner = {
      userId: position2.userId._id || position2.userId,
      username: position2.userId?.username || null,
      email: position2.userId?.email || null,
    };

    // Swap the owners
    const tempUserId = position1.userId._id || position1.userId;
    position1.userId = position2.userId._id || position2.userId;
    position2.userId = tempUserId;

    // Remove from trade list after swap
    position1.isForTrade = false;
    position2.isForTrade = false;

    // Save both positions
    await position1.save();
    await position2.save();

    // Populate new owners
    await position1.populate("userId", "username email");
    await position2.populate("userId", "username email");

    res.status(200).json({
      message: "Positions swapped successfully",
      swapDetails: {
        position1: {
          positionId: position1._id,
          positionNumber: position1.positionNumber,
          gam3yaId: position1.gam3yaId?._id || position1.gam3yaId,
          gam3yaName: position1.gam3yaId?.name || null,
          previousOwner: position1OriginalOwner,
          newOwner: {
            userId: position1.userId._id || position1.userId,
            username: position1.userId?.username || null,
            email: position1.userId?.email || null,
          },
        },
        position2: {
          positionId: position2._id,
          positionNumber: position2.positionNumber,
          gam3yaId: position2.gam3yaId?._id || position2.gam3yaId,
          gam3yaName: position2.gam3yaId?.name || null,
          previousOwner: position2OriginalOwner,
          newOwner: {
            userId: position2.userId._id || position2.userId,
            username: position2.userId?.username || null,
            email: position2.userId?.email || null,
          },
        },
      },
      positions: [position1.toObject(), position2.toObject()],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to swap positions", error: error.message });
  }
};

