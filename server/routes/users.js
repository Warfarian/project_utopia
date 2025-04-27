const express = require("express");
const router = express.Router();
const User = require("../models/User");
const requireAuth = require("../middleware/authMiddleware");

// Get user profile
router.get("/:id", requireAuth, async (req, res) => {
  try {
    console.log(`[GET] /api/users/${req.params.id} - Fetching user profile`);
    // Check if authenticated user is accessing their own profile
    if (req.user.userId !== req.params.id) {
      console.log(`[GET] /api/users/${req.params.id} - Unauthorized access`);
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      console.log(`[GET] /api/users/${req.params.id} - User not found`);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`[GET] /api/users/${req.params.id} - User profile fetched`);
    res.json(user);
  } catch (error) {
    console.error(`[GET] /api/users/${req.params.id} - Error:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put("/:id", requireAuth, async (req, res) => {
  try {
    console.log(
      `[PUT] /api/users/${req.params.id} - Updating user profile`,
      req.body
    );
    // Check if authenticated user is updating their own profile
    if (req.user.userId !== req.params.id) {
      console.log(`[PUT] /api/users/${req.params.id} - Unauthorized access`);
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Restrict updatable fields
    const allowedUpdates = ["name", "email"];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      console.log(`[PUT] /api/users/${req.params.id} - Invalid update fields`);
      return res.status(400).json({ error: "Invalid update fields" });
    }

    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      console.log(`[PUT] /api/users/${req.params.id} - User not found`);
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`[PUT] /api/users/${req.params.id} - User profile updated`);
    res.json(user);
  } catch (error) {
    console.error(`[PUT] /api/users/${req.params.id} - Error:`, error.message);
    res.status(400).json({ error: error.message });
  }
});

// Add volunteer activity
router.post("/:id/volunteer", requireAuth, async (req, res) => {
  try {
    console.log(
      `[POST] /api/users/${req.params.id}/volunteer - Adding volunteer activity`,
      req.body
    );
    // Check if authenticated user is adding to their own history
    if (req.user.userId !== req.params.id) {
      console.log(
        `[POST] /api/users/${req.params.id}/volunteer - Unauthorized access`
      );
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Validate required fields
    const { type, organization, hours, date, description } = req.body;
    if (!type || !organization || !hours || !date || !description) {
      console.log(
        `[POST] /api/users/${req.params.id}/volunteer - Missing required fields`
      );
      return res
        .status(400)
        .json({
          error:
            "All fields (type, organization, hours, date, description) are required",
        });
    }

    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      console.log(
        `[POST] /api/users/${req.params.id}/volunteer - User not found`
      );
      return res.status(404).json({ error: "User not found" });
    }

    const activity = {
      id: Date.now().toString(),
      type,
      organization,
      hours: Number(hours),
      date: new Date(date),
      description,
    };

    user.volunteerHistory.unshift(activity);
    user.stats.volunteeredHours += activity.hours;
    await user.save();

    console.log(
      `[POST] /api/users/${req.params.id}/volunteer - Volunteer activity added`
    );
    res.status(201).json(user);
  } catch (error) {
    console.error(
      `[POST] /api/users/${req.params.id}/volunteer - Error:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
});

// Redeem reward
router.post("/:id/rewards/:rewardId/redeem", requireAuth, async (req, res) => {
  try {
    console.log(
      `[POST] /api/users/${req.params.id}/rewards/${req.params.rewardId}/redeem - Redeeming reward`
    );
    // Check if authenticated user is redeeming their own reward
    if (req.user.userId !== req.params.id) {
      console.log(
        `[POST] /api/users/${req.params.id}/rewards/${req.params.rewardId}/redeem - Unauthorized access`
      );
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      console.log(
        `[POST] /api/users/${req.params.id}/rewards/${req.params.rewardId}/redeem - User not found`
      );
      return res.status(404).json({ error: "User not found" });
    }

    // Find reward using MongoDB query
    const reward = user.rewards.find((r) => r.id === req.params.rewardId);
    if (!reward) {
      console.log(
        `[POST] /api/users/${req.params.id}/rewards/${req.params.rewardId}/redeem - Reward not found`
      );
      return res.status(404).json({ error: "Reward not found" });
    }

    if (reward.status === "redeemed") {
      console.log(
        `[POST] /api/users/${req.params.id}/rewards/${req.params.rewardId}/redeem - Reward already redeemed`
      );
      return res.status(400).json({ error: "Reward already redeemed" });
    }

    // Update reward status using MongoDB update
    await User.updateOne(
      { id: req.params.id, "rewards.id": req.params.rewardId },
      {
        $set: {
          "rewards.$.status": "redeemed",
          "rewards.$.redeemedAt": new Date(),
        },
        $inc: { "stats.rewardsEarned": 1 },
      }
    );

    const updatedUser = await User.findOne({ id: req.params.id });
    console.log(
      `[POST] /api/users/${req.params.id}/rewards/${req.params.rewardId}/redeem - Reward redeemed`
    );
    res.json(updatedUser);
  } catch (error) {
    console.error(
      `[POST] /api/users/${req.params.id}/rewards/${req.params.rewardId}/redeem - Error:`,
      error.message
    );
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
