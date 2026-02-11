const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// CREATE complaint
// CREATE complaint with custom CVC ID
router.post("/", async (req, res) => {
  try {
    const count = await Complaint.countDocuments();

    const nextNumber = count + 1;
    const complaintId = `CVC-${nextNumber.toString().padStart(6, "0")}`;

    const complaint = new Complaint({
      complaintId,
      ...req.body,
    });

    const savedComplaint = await complaint.save();
    res.status(201).json(savedComplaint);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET complaint by ID
// GET complaint by custom complaintId
router.get("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
