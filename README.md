# Crypto Tracker (MERN) – VR Automations Developer Test

This repository contains a full-stack crypto tracker using MERN (MongoDB, Express, React, Node.js).

## Tech Stack
- Backend: Express.js, Node.js, Mongoose, Axios, node-cron
- Database: MongoDB Atlas (recommended)
- Frontend: React (Vite), Axios

## Folder Structure
- `/server`: Express API + cron + MongoDB models
- `/client`: React dashboard (Vite)

## Backend – Setup
1. Create a MongoDB Atlas database and get a connection string.
2. Create a `.env` file inside `/server` with:
```
PORT=4000
MONGODB_URI=<your_mongodb_uri>
# Optional: override CoinGecko URL
# COINGECKO_URL=https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1
```
3. Install and run:
```
cd server
npm install
npm run dev
```
- API base URL: http://localhost:4000
- Endpoints:
  - GET `/api/coins` – fetch live data from CoinGecko (and upsert to CurrentData)
  - POST `/api/history` – store a snapshot into HistoryData
  - GET `/api/history/:coinId` – return historical data for a coin
  - GET `/api/health` – health check

The cron job runs hourly (at minute 0) and stores a snapshot into HistoryData while overwriting CurrentData.

## Frontend – Setup
1. Create a `.env` file inside `/client` with:
```
VITE_API_BASE_URL=http://localhost:4000
```
2. Install and run:
```
cd client
npm install
npm run dev
```
Open the Vite URL (usually http://localhost:5173) to view the dashboard.

### Frontend Features
- Top 10 coins with: Name, Symbol, Current Price (USD), Market Cap, 24h % Change, Last Updated
- Auto-refresh every 30 minutes
- Search by name/symbol
- Click headers to sort columns

## Deployment
- Backend: Render / Railway / Cyclic (Node.js + MongoDB URI in environment)
- Frontend: Vercel / Netlify (set `VITE_API_BASE_URL` to your deployed backend URL)
- Database: MongoDB Atlas (free tier)

Steps (example):
- Push to GitHub
- Deploy `/server` to Render (Start command: `npm start`, Build: `npm install`)
- Set environment variables on the host (`MONGODB_URI`, `PORT`)
- Deploy `/client` to Vercel, set env `VITE_API_BASE_URL`

## Screenshots to Provide
- Database collection documents (e.g., `CurrentData`, `HistoryData`)
- Cron job logs (from server logs on host) or screenshot of Render cron schedule if used externally

## Notes
- The backend upserts current data on every GET `/api/coins` and during cron.
- History snapshots are appended hourly by cron and via POST `/api/history`.


