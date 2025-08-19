# YouTube Video Analyzer with Gemini AI

A powerful web application that analyzes YouTube videos using Google's Gemini AI with URL context support. Simply paste a YouTube URL and get detailed insights about the video content.

## ✨ Features

- **YouTube Video Analysis**: Analyze any public YouTube video using Google's Gemini AI
- **URL Context Support**: Leverages Gemini's `urlContext` tool for direct video processing
- **Beautiful Web Interface**: Clean, responsive design with loading states and error handling
- **RESTful API**: Well-documented API endpoints for programmatic access
- **Comprehensive Testing**: Full test suite with 9 automated tests
- **Production Ready**: Deployed on Vercel with proper error handling and CORS support

## 🚀 Live Demo

- **Web Interface**: [https://gemini-youtube-new.vercel.app](https://gemini-youtube-new.vercel.app)
- **API Endpoint**: `POST /api/analyze`

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ 
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aviz85/gemini-youtube-analyzer.git
   cd gemini-youtube-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```

4. **Run locally**
   ```bash
   # Option 1: Using Vercel dev
   npm run vercel-dev
   
   # Option 2: Simple Express server
   node -e "
   const express=require('express');
   const app=express();
   app.use(express.json(),express.static('.'));
   app.all('/api/*',(req,res)=>require('./api/'+req.path.split('/')[2])(req,res));
   app.listen(8080,()=>console.log('✅ Running: http://localhost:8080'));
   "
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📋 API Usage

### Analyze Video

**Endpoint:** `POST /api/analyze`

**Request Body:**
```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "prompt": "What is this video about? Provide a detailed summary."
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "This video is the official music video for Rick Astley's iconic song 'Never Gonna Give You Up.' It features Rick Astley singing and dancing in various locations..."
}
```

**Error Response:**
```json
{
  "error": "Please provide a valid YouTube URL"
}
```

### Test Connection

**Endpoint:** `GET /api/analyze`

**Response:**
```json
{
  "message": "YouTube Analyzer API is working",
  "timestamp": "2025-08-19T08:52:36.715Z",
  "endpoints": {
    "POST /api/analyze": "Analyze YouTube video content"
  }
}
```

## 🔧 Configuration

### Environment Variables

- `GEMINI_API_KEY` (required): Your Google Gemini API key

### Deployment

**Vercel (recommended):**
```bash
npm run deploy
```

**Other platforms:**
- The app works on any Node.js hosting platform
- API functions are in the `/api` directory
- Static files are served from the root

## 🧪 Testing

The project includes comprehensive tests covering:

- CORS handling
- Input validation  
- YouTube URL format validation
- API error handling
- Streaming response aggregation
- Edge cases and error scenarios

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
├── api/
│   ├── analyze.js          # Main YouTube analyzer endpoint
│   └── hello.js            # Test endpoint
├── __tests__/
│   └── analyze.test.js     # Comprehensive test suite
├── index.html              # Beautiful web interface
├── vercel.json            # Vercel deployment config
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🔐 Security Features

- Input validation and sanitization
- CORS headers properly configured
- Environment variable protection
- Error message sanitization
- Rate limiting ready (can be easily added)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for the powerful video analysis capabilities
- Vercel for seamless deployment platform
- The open-source community for inspiration and tools

## ⚡ Performance

- Streaming responses for faster perceived performance
- Efficient error handling
- Minimal dependencies
- Optimized for both development and production

---

**Made with ❤️ by [aviz85](https://github.com/aviz85)**