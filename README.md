# GREENLOOP

GREENLOOP is a waste management website built with HTML, CSS, JavaScript, Express, and MongoDB.

## Features

- Waste collection booking form
- Service overview for households and businesses
- Green impact statistics
- MongoDB-backed pickup request storage
- Responsive design for desktop and mobile devices

## Project Structure

- `public/` - Frontend HTML, CSS, and JavaScript
- `server.js` - Express backend and MongoDB integration
- `.env.example` - Example environment variables
- `package.json` - Dependencies and scripts

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and update the MongoDB URI if needed.
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3001`

## API Endpoints

- `GET /api/health` - checks service health
- `POST /api/requests` - submits a pickup request
- `GET /api/requests` - fetches all pickup requests

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
