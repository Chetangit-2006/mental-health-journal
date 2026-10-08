const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");

const router = express.Router();

// ===============================
// AI CHAT
// ===============================
router.post("/chat", authMiddleware, async (req, res) => {
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({
            message: "Message is required"
        });
    }

    try {
        // Stop Gemini request if it takes more than 15 seconds
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 15000);

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },

                body: JSON.stringify({
                    systemInstruction: {
                        parts: [
                            {
                                text:
                                    "You are a supportive wellness assistant for a mental health journaling application. " +
                                    "Be empathetic, supportive, and concise. " +
                                    "Encourage healthy reflection and coping strategies. " +
                                    "Do not diagnose mental health conditions. " +
                                    "Do not prescribe medication. " +
                                    "Do not present yourself as a doctor or therapist. " +
                                    "If the user expresses immediate danger or intent to harm themselves " +
                                    "or someone else, encourage them to contact local emergency services " +
                                    "or a crisis helpline and seek immediate help."
                            }
                        ]
                    },

                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: message.trim()
                                }
                            ]
                        }
                    ]
                }),

                signal: controller.signal
            }
        );

        clearTimeout(timeout);

        const data = await response.json();

        console.log("Gemini HTTP Status:", response.status);

        // Gemini API error
        if (!response.ok) {
            console.error(
                "Gemini API Error:",
                JSON.stringify(data, null, 2)
            );

            return res.status(502).json({
                message: "Gemini API request failed",
                error: data.error?.message || "Unknown Gemini API error"
            });
        }

        // Extract AI response
        const reply = data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

        if (!reply) {
            return res.status(502).json({
                message: "Gemini returned an empty response"
            });
        }

        // Save chat in MongoDB
        await Chat.create({
            userId: req.userId,
            message: message.trim(),
            reply: reply
        });

        // Send response to frontend
        res.json({
            reply: reply
        });

    } catch (error) {

        // Request timeout
        if (error.name === "AbortError") {
            console.error("Gemini request timed out.");

            return res.status(504).json({
                message:
                    "AI response took too long. Please try again."
            });
        }

        console.error("Gemini connection error:", error);

        res.status(503).json({
            message: "Unable to connect to Gemini API",
            error: error.message
        });
    }
});


// ===============================
// CHAT HISTORY
// ===============================
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const chats = await Chat.find({
            userId: req.userId
        }).sort({
            createdAt: 1
        });

        res.json(chats);

    } catch (error) {
        console.error(
            "Chat history error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch chat history"
        });
    }
});


module.exports = router;