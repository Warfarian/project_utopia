const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    position: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    createdBy: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pin", pinSchema);
