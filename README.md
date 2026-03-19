# ZapClip — Video & Audio Downloader

A fast, free video downloader supporting YouTube, Instagram, TikTok, Twitter/X, Facebook and 1000+ more sites.

---

## Project Structure

```
zapclip/                  → Frontend (React + Vite)
Backend/          → Backend (Node.js + Express)
```

---

## Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Downloader | yt-dlp |
| Audio/Video Processing | ffmpeg |

---

## Prerequisites

Make sure these are installed on your system:

- Node.js (v18+)
- Python (for yt-dlp)
- yt-dlp
- ffmpeg

### Install yt-dlp
```bash
pip install yt-dlp
```

### Install ffmpeg (Windows)
```bash
winget install ffmpeg
```

---

## Setup & Run

### 1. Backend

```bash
cd streamcast-backend
npm install
```

`.env` file banao:
```
PORT=3000
```

Run karo:
```bash
npm run dev
```

Server `http://localhost:3000` pe chalega.

---

### 2. Frontend (Development)

```bash
cd streamcast
npm install
npm run dev
```

Frontend `http://localhost:5173` pe chalega.

---

### 3. Frontend (Production Build)

```bash
cd streamcast
npm run build
```

`dist` folder ka content `streamcast-backend/public/` mein copy karo.

Ab sirf backend chalao — frontend + backend dono `http://localhost:3000` pe milenge.

---

## API Endpoints

### `POST /api/info`
Video ki information fetch karta hai.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=xxx"
}
```

**Response:**
```json
{
  "title": "Video Title",
  "channel": "Channel Name",
  "duration": "10:45",
  "thumbnail": "https://..."
}
```

---

### `GET /api/download`
Video/Audio download karta hai.

**Query Params:**

| Param | Values |
|-------|--------|
| url | Video URL |
| format | `mp4` or `mp3` |
| quality | `1080`, `720`, `360` (MP4) or `320`, `192`, `128` (MP3) |

**Example:**
```
GET /api/download?url=https://youtu.be/xxx&format=mp4&quality=720
```

---

## Supported Sites

- YouTube
- Instagram
- TikTok
- Twitter / X
- Facebook
- Vimeo
- Reddit
- 1000+ more (powered by yt-dlp)

---

## Folder Structure

```
streamcast-backend/
├── public/              → Frontend build files
├── src/
│   ├── app.js           → Express app setup
│   ├── controllers/
│   │   └── download.controller.js
│   └── routes/
│       └── download.routes.js
├── .env                 → Environment variables
├── .gitignore
├── package.json
└── server.js

streamcast/
├── src/
│   ├── App.jsx          → Main component
│   ├── LightPillar.jsx  → Hero background effect
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## .gitignore

```
node_modules
.env
dist
```

---

## Deployment

1. Server pe `yt-dlp` aur `ffmpeg` install karo
2. Backend deploy karo (Railway / Render / VPS)
3. `PORT` environment variable set karo
4. Frontend build karke `public` folder mein rakho

---

## License

MIT
