const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    try {
        const { angryEmail } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Convert the following angry emails into polite, professional emails.

        Angry Email:
        "Your product is a total mess! It's slow and doesn't work. I want a refund now."
        
        Polite Email:
        "Subject: Inquiry Regarding Product Performance
        
        Dear Customer Support Team,
        
        I am writing to express some concerns I've been having with the product. I've noticed that its performance is not meeting my expectations, and I'm experiencing issues with its speed and functionality.
        
        Could you please advise on any troubleshooting steps or updates that might address these issues? I would also like to discuss the possibility of a refund if a solution cannot be found.
        
        Thank you for your time and assistance.
        
        Sincerely,
        A Concerned Customer"
        
        ---
        
        Angry Email:
        "I'm so fed up with your terrible customer service! No one is helping me. I've been waiting for a response for days!"
        
        Polite Email:
        "Subject: Follow-up on Previous Inquiry
        
        Dear Customer Support,
        
        I am following up on a previous request regarding my account. I have been awaiting a response and would appreciate an update at your earliest convenience.
        
        Could you please look into the status of my request?
        
        Thank you for your assistance.
        
        Best regards,
        A Customer"
        
        ---
        
        Angry Email:
        "${angryEmail}"
        
        Polite Email:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const politeEmail = response.text();

        res.json({ politeEmail });
    } catch (error) {
        console.error('Multi-shot prompting error:', error);
        res.status(500).json({ message: 'Error converting email' });
    }
});

module.exports = router;