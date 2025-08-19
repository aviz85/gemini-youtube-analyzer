require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function testGemini() {
  console.log('Testing Gemini API...');
  console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
  
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const tools = [{ urlContext: {} }];
    const config = {
      thinkingConfig: { thinkingBudget: -1 },
      tools,
    };

    const contents = [{
      role: 'user',
      parts: [{
        fileData: {
          fileUri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          mimeType: 'video/*',
        }
      }, {
        text: 'What is this video about? Give me a very brief summary.',
      }],
    }];

    console.log('Making request to Gemini...');
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      config,
      contents,
    });

    let result = '';
    for await (const chunk of response) {
      result += chunk.text || '';
    }

    console.log('SUCCESS! Response:', result.substring(0, 200) + '...');
    return true;
  } catch (error) {
    console.error('ERROR:', error.message);
    return false;
  }
}

testGemini();