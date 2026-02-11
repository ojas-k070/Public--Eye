const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "In Progress", "Resolved"],
    },

    department: {
      type: String,
      default: "General Department",
    },

    zone: {
      type: String,
      default: "Unknown Zone",
    },

    location: {
      address: {
        type: String,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      timestamp: {
        type: String,
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
