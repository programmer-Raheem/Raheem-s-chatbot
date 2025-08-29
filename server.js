import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// Route for chatbot messages
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // or "gpt-4.1"
        input: [
          {
            role: "user",
            content: [{ type: "input_text", text: message }],
          },
        ],
      }),
    });

    const data = await response.json();
    const botMessage = data.output[0].content[0].text;
    res.json({ reply: botMessage });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Server error, please try again." });
  }
});

// Start server
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});