const express = require("express");
const router = express.Router();
const Shelter = require("../models/Shelter");
const requireAuth = require("../middleware/authMiddleware");

// Get all shelters
router.get("/", requireAuth, async (req, res) => {
  try {
    console.log("[GET] /api/shelters - Fetching all shelters");
    const shelters = await Shelter.find();
    console.log(`[GET] /api/shelters - Found ${shelters.length} shelters`);
    res.json(shelters);
  } catch (error) {
    console.error("[GET] /api/shelters - Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get shelter by ID
router.get("/:id", requireAuth, async (req, res) => {
  try {
    console.log(`[GET] /api/shelters/${req.params.id} - Fetching shelter`);
    const shelter = await Shelter.findOne({ id: req.params.id });
    if (!shelter) {
      console.log(`[GET] /api/shelters/${req.params.id} - Shelter not found`);
      return res.status(404).json({ error: "Shelter not found" });
    }
    console.log(`[GET] /api/shelters/${req.params.id} - Found shelter`);
    res.json(shelter);
  } catch (error) {
    console.error(
      `[GET] /api/shelters/${req.params.id} - Error:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

// Create shelter (admin only)
router.post("/", requireAuth, async (req, res) => {
  try {
    console.log("[POST] /api/shelters - Creating new shelter:", req.body);
    const shelter = new Shelter({
      id: Date.now().toString(),
      ...req.body,
    });
    await shelter.save();
    console.log("[POST] /api/shelters - Created shelter:", shelter.id);
    res.status(201).json(shelter);
  } catch (error) {
    console.error("[POST] /api/shelters - Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Update shelter (admin only)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    console.log(
      `[PUT] /api/shelters/${req.params.id} - Updating shelter:`,
      req.body
    );
    const shelter = await Shelter.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!shelter) {
      console.log(`[PUT] /api/shelters/${req.params.id} - Shelter not found`);
      return res.status(404).json({ error: "Shelter not found" });
    }
    console.log(`[PUT] /api/shelters/${req.params.id} - Updated shelter`);
    res.json(shelter);
  } catch (error) {
    console.error(
      `[PUT] /api/shelters/${req.params.id} - Error:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
