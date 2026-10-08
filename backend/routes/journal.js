const express = require("express");
const Journal = require("../models/Journal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create journal
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content, mood } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const journal = await Journal.create({
            userId: req.userId,
            title,
            content,
            mood
        });

        res.status(201).json({
            message: "Journal created successfully",
            journal
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create journal",
            error: error.message
        });
    }
});

// Get user's journals
router.get("/", authMiddleware, async (req, res) => {
    try {
        const journals = await Journal.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json(journals);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch journals",
            error: error.message
        });
    }
});

// Update journal
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content, mood } = req.body;

        const journal = await Journal.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                title,
                content,
                mood
            },
            { new: true }
        );

        if (!journal) {
            return res.status(404).json({
                message: "Journal not found"
            });
        }

        res.json({
            message: "Journal updated successfully",
            journal
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update journal",
            error: error.message
        });
    }
});

// Delete journal
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const journal = await Journal.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!journal) {
            return res.status(404).json({
                message: "Journal not found"
            });
        }

        res.json({
            message: "Journal deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete journal",
            error: error.message
        });
    }
});

module.exports = router;