const { dbConnection } = require("../config");
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  reportId: { type: String, required: true },
  verifyingDevice: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  verificationType: {
    type: String,
    enum: ["document", "report", "end"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String, required: true },
});

module.exports = dbConnection.model("Log", logSchema);
