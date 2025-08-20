const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { tool } = require('@google/generative-ai');

// Dummy function to simulate looking up a support ticket
const getTicketStatus = (ticketId) => {
    const statuses = {
        "TICKET-1234": "In Progress",
        "TICKET-5678": "Resolved"
    };
    return statuses[ticketId] || "Not Found";
};

router.post('/', async (req, res) => {
    try {
        const { angryEmail } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const functionDeclarations = [
            {
                name: 'getTicketStatus',
                description: 'Get the status of a specific support ticket by its ID.',
                parameters: {
                    type: 'object',
                    properties: {
                        ticketId: {
                            type: 'string',
                            description: 'The ID of the support ticket.'
                        }
                    },
                    required: ['ticketId']
                }
            }
        ];

        // First API call: The model will determine if it needs to call a function
        const result1 = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{ text: angryEmail }]
            }],
            tools: [{ functionDeclarations }]
        });

        const response1 = await result1.response;
        const functionCall = response1.functionCall();
        
        if (functionCall && functionCall.name === 'getTicketStatus') {
            const { ticketId } = functionCall.args;
            const ticketStatus = getTicketStatus(ticketId);

            // Second API call: Send the function output back to the model
            const result2 = await model.generateContent({
                contents: [{
                    role: 'user',
                    parts: [{ text: angryEmail }]
                }, {
                    role: 'model',
                    parts: [{
                        functionCall: { name: 'getTicketStatus', args: { ticketId } }
                    }]
                }, {
                    role: 'tool',
                    parts: [{
                        functionResponse: { name: 'getTicketStatus', response: { status: ticketStatus } }
                    }]
                }],
                tools: [{ functionDeclarations }]
            });
            const response2 = await result2.response;
            const politeEmail = response2.text();
            res.json({ politeEmail, ticketStatus });
        } else {
            // No function call, just convert the email
            const politeEmail = response1.text();
            res.json({ politeEmail });
        }

    } catch (error) {
        console.error('Function calling error:', error);
        res.status(500).json({ message: 'Error converting email' });
    }
});

module.exports = router;