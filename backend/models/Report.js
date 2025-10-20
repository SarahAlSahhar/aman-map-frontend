const { dbConnection } = require("../config");
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  dangerType: {
    type: String,
    enum: ["evacuation", "incursion", "fire_control", "hard_to_reach"],
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  reportedByDevice: { type: String, required: true },
  status: { type: String, enum: ["pending", "verified", "rejected"] },
  confirmations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
  verificationSummary: {
    documentCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },
    endCount: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

reportSchema.index({ coordinates: "2dsphere" }); // Geospatial index

module.exports = dbConnection.model("Report", reportSchema);
