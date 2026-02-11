const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");


// ==============================
// CREATE COMPLAINT (Custom CVC ID)
// ==============================
router.post("/", async (req, res) => {
  try {
    // Get last complaint sorted by newest
    const lastComplaint = await Complaint.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastComplaint && lastComplaint.complaintId) {
      const lastNumber = parseInt(lastComplaint.complaintId.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const complaintId = `CVC-${nextNumber
      .toString()
      .padStart(6, "0")}`;

    const complaint = new Complaint({
      complaintId,
      ...req.body,
    });

    const savedComplaint = await complaint.save();

    res.status(201).json(savedComplaint);

  } catch (error) {
    console.error("Create complaint error:", error);
    res.status(500).json({ message: "Failed to create complaint" });
  }
});


// ==============================
// GET ALL COMPLAINTS
// ==============================
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error("Fetch all complaints error:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});
// UPDATE complaint status
router.put("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: req.params.id },
      { status: req.body.status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// ==============================
// GET COMPLAINT BY CUSTOM ID
// ==============================
router.get("/:complaintId", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);

  } catch (error) {
    console.error("Fetch complaint error:", error);
    res.status(500).json({ message: "Failed to fetch complaint" });
  }
});


module.exports = router;
