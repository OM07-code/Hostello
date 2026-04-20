const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../../E/Workspace/Hostello/.env') }); 
// actually I'll just hardcode absolute path
dotenv.config({ path: 'E:/Workspace/Hostello/.env' });

async function run() {
  try {
    console.log("Key starts with:", process.env.GEMINI_API_KEY?.substring(0, 5));
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: "Hello",
    });
    console.log(response.text);
  } catch (err) {
    console.error("Gemini ERror:", err);
  }
}
run();
