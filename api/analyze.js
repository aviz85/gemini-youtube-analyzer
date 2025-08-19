const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Add GET for testing
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'YouTube Analyzer API is working', 
      timestamp: new Date().toISOString(),
      endpoints: {
        'POST /api/analyze': 'Analyze YouTube video content'
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { youtubeUrl, prompt } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    if (!youtubeUrl.includes('youtube.com/watch') && !youtubeUrl.includes('youtu.be/')) {
      return res.status(400).json({ error: 'Please provide a valid YouTube URL' });
    }

    const userPrompt = prompt || 'Tell me what they said in this video. Provide a detailed summary.';

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const tools = [
      { urlContext: {} },
    ];

    const geminiConfig = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
    };

    const model = 'gemini-2.5-flash';

    const contents = [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: youtubeUrl,
              mimeType: 'video/*',
            }
          },
          {
            text: userPrompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config: geminiConfig,
      contents,
    });

    let result = '';
    for await (const chunk of response) {
      result += chunk.text || '';
    }

    return res.status(200).json({ success: true, analysis: result });

  } catch (error) {
    console.error('Error analyzing video:', error);
    return res.status(500).json({ error: 'Failed to analyze video: ' + error.message });
  }
};