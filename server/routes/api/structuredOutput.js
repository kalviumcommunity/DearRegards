const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    try {
        const { angryEmail } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Using a model that supports structured output

        const prompt = `Convert this angry email into a polite, professional email. Return the output as a JSON object with 'subject' and 'body' fields.
        Angry Email: "${angryEmail}"`;

        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                responseMimeType: 'application/json'
            }
        });
        
        const response = await result.response;
        const jsonResponse = JSON.parse(response.text());

        res.json(jsonResponse);
    } catch (error) {
        console.error('Structured output error:', error);
        res.status(500).json({ message: 'Error converting email' });
    }
});

module.exports = router;