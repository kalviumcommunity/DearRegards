const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const testData = require('../data/evaluation_data.json');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function runTests() {
    let correctCount = 0;
    
    for (const testCase of testData) {
        const prompt = `Convert the following angry email into a polite, professional email.
        
        Angry Email:
        "${testCase.angry_email}"
        
        Polite Email:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedEmail = response.text().trim();

        // Simple check for now: a real-world test would use more advanced metrics
        const isPolite = generatedEmail.toLowerCase().includes('dear') && generatedEmail.toLowerCase().includes('sincerely');

        if (isPolite) {
            correctCount++;
            console.log(`✅ Test passed for: "${testCase.angry_email}"`);
        } else {
            console.log(`❌ Test failed for: "${testCase.angry_email}"`);
            console.log('Generated Output:', generatedEmail);
        }
    }

    console.log(`\n--- Test Summary ---`);
    console.log(`Total tests: ${testData.length}`);
    console.log(`Passing tests: ${correctCount}`);
    console.log(`Success rate: ${((correctCount / testData.length) * 100).toFixed(2)}%`);
}

runTests();