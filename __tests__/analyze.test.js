// Jest is globally available

// Mock the @google/genai module
const mockGenerateContentStream = jest.fn();
const mockGoogleGenAI = jest.fn().mockImplementation(() => ({
  models: {
    generateContentStream: mockGenerateContentStream
  }
}));

jest.mock('@google/genai', () => ({
  GoogleGenAI: mockGoogleGenAI
}));

// Import the handler after mocking
const handler = require('../api/analyze.js');

// Mock response object
const createMockRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis()
  };
  return res;
};

describe('API /analyze', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  test('should handle OPTIONS requests', async () => {
    const req = { method: 'OPTIONS' };
    const res = createMockRes();

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Content-Type');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  test('should handle GET requests for testing', async () => {
    const req = { method: 'GET' };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'YouTube Analyzer API is working',
      timestamp: expect.any(String),
      endpoints: expect.any(Object)
    }));
  });

  test('should reject other non-POST requests', async () => {
    const req = { method: 'PUT' };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  test('should require YouTube URL', async () => {
    const req = { 
      method: 'POST',
      body: {}
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'YouTube URL is required' });
  });

  test('should validate YouTube URL format', async () => {
    const req = { 
      method: 'POST',
      body: {
        youtubeUrl: 'https://example.com/invalid'
      }
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Please provide a valid YouTube URL' });
  });

  test('should accept valid YouTube URLs', async () => {
    const validUrls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ'
    ];

    for (const url of validUrls) {
      mockGenerateContentStream.mockResolvedValueOnce({
        async *[Symbol.asyncIterator]() {
          yield { text: 'Mock analysis result' };
        }
      });

      const req = { 
        method: 'POST',
        body: {
          youtubeUrl: url,
          prompt: 'Test prompt'
        }
      };
      const res = createMockRes();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        success: true, 
        analysis: 'Mock analysis result' 
      });
    }
  });

  test('should use default prompt when none provided', async () => {
    mockGenerateContentStream.mockResolvedValueOnce({
      async *[Symbol.asyncIterator]() {
        yield { text: 'Mock analysis result' };
      }
    });

    const req = { 
      method: 'POST',
      body: {
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ 
      success: true, 
      analysis: 'Mock analysis result' 
    });
    
    // Verify the default prompt was used
    const call = mockGenerateContentStream.mock.calls[0][0];
    expect(call.contents[0].parts[1].text).toBe('Tell me what they said in this video. Provide a detailed summary.');
  });

  test('should handle API errors gracefully', async () => {
    mockGenerateContentStream.mockRejectedValueOnce(new Error('API Error'));

    const req = { 
      method: 'POST',
      body: {
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Failed to analyze video: API Error' 
    });
  });

  test('should aggregate streaming response', async () => {
    mockGenerateContentStream.mockResolvedValueOnce({
      async *[Symbol.asyncIterator]() {
        yield { text: 'Part 1 ' };
        yield { text: 'Part 2 ' };
        yield { text: 'Part 3' };
      }
    });

    const req = { 
      method: 'POST',
      body: {
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    };
    const res = createMockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ 
      success: true, 
      analysis: 'Part 1 Part 2 Part 3' 
    });
  });
});