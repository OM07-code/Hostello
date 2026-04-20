const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: 'E:/Workspace/Hostello/.env' });

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Hello",
    });
    console.log("Response:", response.text);
  } catch (err) {
    const fs = require('fs');
    fs.writeFileSync('error_dump.json', JSON.stringify({
      message: err.message,
      status: err.status,
      details: err
    }, null, 2));
    console.log("Wrote error to dump.json");
  }
}
run();
