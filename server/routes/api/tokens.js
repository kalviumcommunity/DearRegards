const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    try {
        const { text } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { totalTokens } = await model.countTokens(text);
        
        res.json({ 
            originalText: text,
            tokenCount: totalTokens
        });
    } catch (error) {
        console.error('Token counting error:', error);
        res.status(500).json({ message: 'Error counting tokens' });
    }
});

module.exports = router;