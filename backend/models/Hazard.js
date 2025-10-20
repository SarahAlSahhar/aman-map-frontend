const { dbConnection } = require("../config");
const mongoose = require("mongoose");

const hazardSchema = new mongoose.Schema({
  geometry: {
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
  colorCode: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  relatedReports: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
  },
});

hazardSchema.index({ geometry: "2dsphere" });

module.exports = dbConnection.model("Hazard", hazardSchema);
