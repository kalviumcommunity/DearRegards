const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    try {
        const { angryEmail } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Convert the following angry email into a polite, professional email. First, analyze the key points of frustration and the underlying requests in the original email. Then, use those points to draft the new email.
        
        Angry Email:
        "${angryEmail}"
        
        Polite Email:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const politeEmail = response.text();

        res.json({ politeEmail });
    } catch (error) {
        console.error('Chain of thought error:', error);
        res.status(500).json({ message: 'Error converting email' });
    }
});

module.exports = router;