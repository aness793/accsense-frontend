# AcciSense Frontend

React/Vite frontend for AcciSense — an automatic road accident detection and severity estimation system using deep learning on surveillance video.

## Overview

This frontend provides:
- Video upload and model selection interface
- Real-time inference results display with severity classification
- Live monitoring dashboard via WebSocket (MQTT feed from edge devices)
- Accident history table from the database
- PDF incident report download
- Multi-language support (English, French, Arabic with RTL)

## Tech Stack

- **Framework**: React + Vite
- **Styling**: CSS
- **i18n**: react-i18next
- **Deployment**: Vercel

## Project Structure

```
AcciSense-frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   │   └── useLiveFeed.js   # WebSocket hook for live MQTT feed
│   ├── i18n/                # Translation files
│   └── main.jsx
├── public/
│   └── figures/             # Architecture diagram images
├── .env                     # Local environment variables
├── .env.production          # Production environment variables
└── vite.config.js
```

## Environment Variables

For local development, create a `.env` file:

```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

For production, create a `.env.production` file:

```
VITE_API_URL=https://your-backend-url
VITE_WS_URL=wss://your-backend-url/ws
```

## Running Locally

```bash
npm install
npm run dev
```

Make sure the backend is running on port 8000 before starting the frontend.

## Building for Production

```bash
npm run build
```

The output will be in the `dist/` folder.

## Features

- **Detection**: Upload a video clip and select R3D-18, SlowFast, or Swin Transformer to run inference
- **Live Monitor**: Real-time feed from edge camera simulator via WebSocket
- **History**: Table of past detections pulled from Supabase
- **Report**: Download a PDF incident report for major accidents
- **Dark Mode**: Toggle between light and dark themes
- **i18n**: Supports English, French, and Arabic (RTL)

## Author

Aness Rahmani — Master's Thesis, Université Djilali Bounaama Khemis Miliana  
Supervisor: Slim Rouabah
