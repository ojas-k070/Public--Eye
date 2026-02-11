const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
  address: String,
  latitude: Number,
  longitude: Number,
  timestamp: String,
},
zone: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);
