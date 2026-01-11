const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.static("public"));

app.get("/recommend", async (req, res) => {
    try {
        const userInput = req.query.input;
        if (!userInput) return res.status(400).json({ error: "Input is required" });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Recommend 5 books for someone who likes: "${userInput}"

Return ONLY a JSON array in this exact format, no other text:
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "description": "One sentence description"
  }
]`;

        const result = await model.generateContent(prompt);
        let response = result.response.text();

        const cleaned = response.replace(/```json\s*/, '').replace(/```/, '').trim();
        const books = JSON.parse(cleaned);

        res.json(books);
    } catch (error) {
        console.error("Error generating recommendations");
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});