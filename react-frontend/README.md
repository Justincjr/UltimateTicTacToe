# Ultimate Tic Tac Toe - React Frontend

A beautiful React-based UI for the Ultimate Tic Tac Toe game with an AI opponent.

## Features

- 🎨 Modern, beautiful UI with dark theme
- ✨ Smooth animations with Framer Motion
- 🤖 Play against AI opponents
- 📱 Responsive design for all devices
- 🎯 Visual indicators for valid moves
- 🏆 Win/lose/draw detection

## Setup

### Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- pip installed

### Backend Setup

1. Install Python dependencies:
```bash
cd UltimateTicTacToe
pip install flask flask-cors numpy torch
```

2. Start the Flask server:
```bash
python flaskserver.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the React frontend:
```bash
cd react-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How to Play

1. Choose to play as X (first move) or O (second move)
2. Click on any valid cell (highlighted) to make your move
3. Your move determines which board your opponent must play in next
4. Win 3 small boards in a row to win the game!

## API Endpoints

- `POST /api/start` - Start a new game
- `POST /api/move` - Make a move
- `GET /api/state` - Get current game state
- `POST /api/reset` - Reset the game

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Framer Motion
- **Backend**: Flask, Python
- **AI**: Neural network-based agent with PyTorch
