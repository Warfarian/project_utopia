const express = require("express");
const router = express.Router();
const Pin = require("../models/Pin");
const User = require("../models/User");

const requireAuth = require("../middleware/authMiddleware");
// Get all pins
router.get("/", requireAuth, async (req, res) => {
  try {
    console.log("[GET] /api/pins - Fetching all pins");
    const pins = await Pin.find();
    // Fetch user data for each pin
    const pinsWithUsers = await Promise.all(
      pins.map(async (pin) => {
        const user = await User.findOne({ id: pin.createdBy }, "id name");
        return {
          ...pin.toObject(),
          createdBy: { id: user.id, name: user.name },
        };
      })
    );
    console.log(`[GET] /api/pins - Found ${pinsWithUsers.length} pins`);
    res.json(pinsWithUsers);
  } catch (error) {
    console.error("[GET] /api/pins - Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create new pin
router.post("/", requireAuth, async (req, res) => {
  try {
    console.log("[POST] /api/pins - Creating new pin:", req.body);
    const pin = new Pin({
      id: Date.now().toString(),
      ...req.body,
      timestamp: new Date(),
    });
    await pin.save();
    console.log("[POST] /api/pins - Created pin:", pin.id);
    res.status(201).json(pin);
  } catch (error) {
    console.error("[POST] /api/pins - Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get pin by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    console.log(`[GET] /api/pins/${req.params.id} - Fetching pin`);
    const pin = await Pin.findOne({ id: req.params.id });
    if (!pin) {
      console.log(`[GET] /api/pins/${req.params.id} - Pin not found`);
      return res.status(404).json({ error: "Pin not found" });
    }
    const user = await User.findOne({ id: pin.createdBy }, "id name");
    if (!user) {
      console.log(`[GET] /api/pins/${req.params.id} - User not found for pin`);
      return res.status(404).json({ error: "User not found for pin" });
    }
    console.log(`[GET] /api/pins/${req.params.id} - Found pin`);
    res.json({
      ...pin.toObject(),
      createdBy: { id: user.id, name: user.name },
    });
  } catch (error) {
    console.error(`[GET] /api/pins/${req.params.id} - Error:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete pin
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    console.log(`[DELETE] /api/pins/${req.params.id} - Deleting pin`);
    const pin = await Pin.findOneAndDelete({ id: req.params.id });
    if (!pin) {
      console.log(`[DELETE] /api/pins/${req.params.id} - Pin not found`);
      return res.status(404).json({ error: "Pin not found" });
    }
    console.log(`[DELETE] /api/pins/${req.params.id} - Pin deleted`);
    res.json({ message: "Pin deleted successfully" });
  } catch (error) {
    console.error(
      `[DELETE] /api/pins/${req.params.id} - Error:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
