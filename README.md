# AI Photo Animation Generator

Upload two photos and turn them into an animated GIF (morph, transition or dissolve) using the Runway ML API. React + Tailwind CSS frontend, Node.js/Express backend.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Runway ML](https://img.shields.io/badge/AI-Runway_ML-000000)

## Features

- Upload exactly two images, with thumbnail previews and a button to remove either one.
- Pick an animation type: **Morph**, **Transition** or **Dissolve**.
- The backend sends both images to the Runway ML API, downloads the generated animation as a GIF and serves it from `/animations`.
- View the generated animation in the browser and download it.
- Validation and error messages for missing images or failed generation.

## Tech Stack

| Layer    | Tech                                                   |
|----------|--------------------------------------------------------|
| Frontend | React 18 (Create React App), Tailwind CSS 3, Axios     |
| Backend  | Node.js (ES modules), Express, Multer, Axios, dotenv   |
| AI       | Runway ML API                                          |

## Getting Started

### Prerequisites

- Node.js and npm
- A Runway ML API key

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
RUNWAY_API_KEY=your_runway_api_key
PORT=3001
```

Then start the server (defaults to http://localhost:3001):

```bash
npm start
```

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000, upload two images, choose an animation type and click **Generate Animation**.

## API

| Method | Endpoint        | Description                                                                                     |
|--------|-----------------|-------------------------------------------------------------------------------------------------|
| POST   | `/animate`      | `multipart/form-data` with two files in `images` and an optional `animationType` (default `morph`). Returns `{ animationUrl, serviceUsed }`. |
| GET    | `/animations/*` | Serves generated GIFs.                                                                          |

## Project Structure

```
ImageAnimation/
├── backend/
│   └── server.js          # Express API: upload, call Runway ML, save GIF
└── frontend/
    ├── src/App.js         # Upload UI, animation type picker, result viewer
    └── tailwind.config.js
```
