const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    try {
        const { angryEmail } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{ text: `Convert this email: "${angryEmail}"` }]
            }],
            systemInstruction: {
                role: 'system',
                parts: [{ text: "You are an AI assistant specialized in converting angry, unprofessional emails into calm, polite, and professional communications. You must maintain the core message of the original email while changing the tone to be courteous and solution-oriented." }]
            }
        });
        
        const response = await result.response;
        const politeEmail = response.text();

        res.json({ politeEmail });
    } catch (error) {
        console.error('System/User prompt error:', error);
        res.status(500).json({ message: 'Error converting email' });
    }
});

module.exports = router;