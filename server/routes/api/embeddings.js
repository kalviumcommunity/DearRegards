const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    try {
        const { text } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

        const { embedding } = await embeddingModel.embedContent(text);

        res.json({
            originalText: text,
            embedding: embedding.values
        });
    } catch (error) {
        console.error('Embeddings error:', error);
        res.status(500).json({ message: 'Error generating embedding' });
    }
});

module.exports = router;