const express = require("express");
const router = express.Router();
const User = require("../models/User");
const requireAuth = require("../middleware/authMiddleware");

// All possible rewards (duplicated from frontend for now)
const allRewards = [
  {
    id: '1',
    name: 'Local Cafe Voucher',
    description: '$10 off at participating cafes',
    points: 100,
    category: 'food',
    icon: '☕'
  },
  {
    id: '2',
    name: 'Movie Tickets',
    description: 'Two free movie tickets',
    points: 250,
    category: 'entertainment',
    icon: '🎬'
  },
  {
    id: '3',
    name: 'Amazon Gift Card',
    description: '$25 Amazon gift card',
    points: 300,
    category: 'shopping',
    icon: '🛍️'
  },
  {
    id: '4',
    name: 'Cinema Voucher',
    description: 'Buy one get one free movie ticket',
    points: 150,
    category: 'entertainment',
    icon: '🎟️'
  },
  {
    id: '5',
    name: 'Grocery Store Coupon',
    description: '$20 off at local grocery stores',
    points: 200,
    category: 'food',
    icon: '🛒'
  },
  {
    id: '6',
    name: 'Restaurant Discount',
    description: '30% off at selected restaurants',
    points: 275,
    category: 'food',
    icon: '🍽️'
  }
];

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

    const userData = user.toObject();

    // Initialize stats if they don't exist
    if (!userData.stats) {
      userData.stats = {
        pinsCreated: 0,
        volunteeredHours: 0,
        rewardsEarned: 0,
        points: 500 // Give new users some starting points
      };
    }

    // Add points field if it doesn't exist
    if (userData.stats.points === undefined) {
      userData.stats.points = 500; // Give existing users some points too
    }

    // Add demo rewards if they don't exist
    allRewards.forEach(reward => {
      if (!userData.rewards.some(r => r.id === reward.id)) {
        userData.rewards.push({
          ...reward,
          status: 'available'
        });
      }
    });

    // Add demo badges
    const demoBadges = [
      {
        id: 'badge-1',
        name: 'First Pin',
        description: 'Created your first community pin',
        icon: '📍',
        earnedAt: new Date('2024-01-02')
      },
      {
        id: 'badge-2',
        name: 'Volunteer Hero',
        description: 'Completed 20 hours of volunteering',
        icon: '⭐',
        earnedAt: new Date('2024-02-15')
      },
      {
        id: 'badge-3',
        name: 'Food Champion',
        description: 'Helped distribute food to 50+ people',
        icon: '🥘',
        earnedAt: new Date('2024-02-20')
      }
    ];

    demoBadges.forEach(badge => {
      if (!userData.badges.some(b => b.id === badge.id)) {
        userData.badges.push(badge);
      }
    });

    // Save the updated user data
    await User.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          stats: userData.stats,
          rewards: userData.rewards,
          badges: userData.badges
        }
      }
    );

    console.log(`[GET] /api/users/${req.params.id} - User profile fetched`);
    res.json(userData);
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
    
    // Award points for volunteering (10 points per hour)
    if (!user.stats.points) {
      user.stats.points = 0;
    }
    user.stats.points += activity.hours * 10;
    
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

// Purchase reward
router.post("/:id/rewards/purchase", requireAuth, async (req, res) => {
  try {
    console.log(`[POST] /api/users/${req.params.id}/rewards/purchase - Purchasing reward`);
    
    // Check if authenticated user is purchasing for their own account
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { rewardId } = req.body;
    if (!rewardId) {
      return res.status(400).json({ error: "Reward ID is required" });
    }

    // Find the reward in our catalog
    const reward = allRewards.find(r => r.id === rewardId);
    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }

    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has enough points
    if (!user.stats.points || user.stats.points < reward.points) {
      return res.status(400).json({ error: "Insufficient points" });
    }

    // Check if user already has this reward
    if (user.rewards.some(r => r.id === rewardId)) {
      return res.status(400).json({ error: "Reward already owned" });
    }

    // Add reward to user's rewards and deduct points
    user.rewards.push({
      ...reward,
      status: 'available'
    });
    user.stats.points -= reward.points;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ error: "Failed to purchase reward" });
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
