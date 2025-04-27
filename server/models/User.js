const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  earnedAt: { type: Date, required: true },
});

const rewardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "redeemed"],
    default: "available",
  },
  redeemedAt: { type: Date },
});

const volunteerHistorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  organization: { type: String, required: true },
  hours: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
});

const statsSchema = new mongoose.Schema({
  pinsCreated: { type: Number, default: 0 },
  volunteeredHours: { type: Number, default: 0 },
  rewardsEarned: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    joinedAt: { type: Date, required: true },
    stats: { type: statsSchema, default: () => ({}) },
    badges: [badgeSchema],
    rewards: [rewardSchema],
    volunteerHistory: [volunteerHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
