AI Art Studio
A full-stack internship project that converts natural-language prompts into digital artwork using an image-generation API.

Project Goal
Build a visual application that translates natural-language text descriptions into high-quality digital artwork.

Key requirements implemented
Image-generation API integration
Prompt-based text-to-image generation
Resolution / aspect-ratio controls
Generation count control
Server-side API key protection
Image URL / Base64 image handling
Clean responsive image gallery
Download generated images
Loading, validation, and error states
Provider abstraction for future Stable Diffusion integration
Mock mode for frontend development without an API key
Tech Stack
Frontend
React
Vite
CSS
Fetch API
Backend
Node.js
Express
OpenAI Node SDK
dotenv
Helmet
CORS
Image Provider
The default provider is OpenAI's Images API using gpt-image-2. The provider is isolated in server/services/imageProvider.js, so another provider can be added without changing the frontend.

Architecture
React UI
   |
   | POST /api/images/generate
   v
Express API
   |
   +--> validation / rate limits
   |
   v
Image Provider
   |
   +--> OpenAI Images API
   |
   v
Image URL / Base64 data
   |
   v
React Gallery
   |
   +--> Preview
   +--> Download
Folder Structure
ai-art-studio/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── services/
│   │   └── imageProvider.js
│   ├── index.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
Requirements
Node.js 20+
npm
An API key for the selected image provider
Run locally
1. Install
npm run install:all
2. Configure environment
Copy .env.example to .env:

cp .env.example .env
Add your API key:

OPENAI_API_KEY=your_api_key_here
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
IMAGE_PROVIDER=openai
Never expose the API key in React or commit .env.

3. Start backend and frontend
npm run dev
Open:

http://localhost:5173
The Vite development server proxies /api requests to the Express server.

API
POST /api/images/generate
Request:

{
  "prompt": "A futuristic Indian city at sunset, cinematic digital art",
  "aspectRatio": "16:9",
  "resolution": "1024",
  "count": 2
}
Response:

{
  "images": [
    {
      "id": "generated-1",
      "url": "data:image/png;base64,..."
    }
  ]
}
The backend accepts provider output as either a URL or Base64 image data and normalizes both into a frontend-friendly url.

Supported UI parameters
Aspect ratio: 1:1, 16:9, 9:16, 4:3
Resolution: 1024
Generation count: 1–4
The backend validates all parameters instead of trusting the browser.

Stable Diffusion extension
The application intentionally separates provider-specific code:

server/services/imageProvider.js
To add another provider, implement the same conceptual function:

generateImages({ prompt, aspectRatio, resolution, count })
and return:

[
  { id: "image-1", url: "..." }
]
This keeps the React application independent from the image provider.

Internship learning outcomes
This project demonstrates:

REST API design
Frontend/backend separation
Environment-variable security
Third-party API integration
JSON request/response handling
Binary/Base64/URL image handling
Parameter validation
Responsive UI design
Error handling
Provider abstraction
Security notes
API keys remain on the backend.
Helmet adds standard HTTP security headers.
CORS is restricted to the configured frontend origin.
Request payloads are validated.
.env is ignored by Git.
Important
Image generation is a paid external API operation. The repository includes a mock provider mode for UI development, so you can work on the frontend without making API calls.

Set:

IMAGE_PROVIDER=mock
to use the mock provider.

License
MIT
