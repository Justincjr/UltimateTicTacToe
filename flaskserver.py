from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import StudentAgent
from agent3 import StudentAgent3
from utils import State, get_random_valid_action
import time
import uuid
import numpy as np

app = Flask(__name__)
app.secret_key = 'ultimate-tictactoe-secret-key'
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])


def convert_to_serializable(obj):
    """Convert numpy types to Python native types for JSON serialization"""
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, (np.bool_, np.generic)):
        return obj.item()
    if isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [convert_to_serializable(item) for item in obj]
    return obj

# Store multiple game sessions
sessions = {}


@app.route("/api/start", methods=["POST"])
def start_game():
    """Start a new game session"""
    data = request.json
    player_choice = data.get("player", 1)  # 1 = X (first), 2 = O (second)

    game_id = str(uuid.uuid4())
    state = State(fill_num=1)

    session_data = {
        "state": state,
        "human_fill": player_choice,
        "computer_fill": 3 - player_choice,
        "agent": StudentAgent() if player_choice == 1 else StudentAgent3()
    }

    sessions[game_id] = session_data

    response_data = {
        "game_id": game_id,
        "message": "Game started",
        "player": player_choice,
        "state": state.to_dict(),
        "valid_actions": [list(a) for a in state.get_all_valid_actions()],
        "is_terminal": bool(state.is_terminal()),
        "current_turn": int(state.fill_num)
    }

    # If computer goes first (player chose O), make computer move
    if player_choice == 2:
        state, action = make_computer_move(session_data)
        response_data["state"] = state.to_dict()
        response_data["valid_actions"] = [list(a) for a in state.get_all_valid_actions()]
        response_data["is_terminal"] = bool(state.is_terminal())
        response_data["current_turn"] = int(state.fill_num)
        response_data["computer_action"] = list(action)

    return jsonify(convert_to_serializable(response_data))


@app.route("/api/move", methods=["POST"])
def human_move():
    """Handle human player move"""
    data = request.json
    game_id = data.get("game_id")
    action = tuple(data.get("action"))  # (super_row, super_col, local_row, local_col)

    session_data = sessions.get(game_id)
    if not session_data:
        return jsonify({"error": "Invalid game ID"}), 404

    state = session_data["state"]
    human_fill = session_data["human_fill"]

    # Check if it's human's turn
    if state.fill_num != human_fill:
        return jsonify({"error": "Not your turn"}), 400

    if not state.is_valid_action(action):
        return jsonify({"error": "Invalid move"}), 400

    # Apply human move
    state = state.change_state(action)
    session_data["state"] = state

    is_terminal = bool(state.is_terminal())
    response_data = {
        "message": "Move applied",
        "state": state.to_dict(),
        "valid_actions": [list(a) for a in state.get_all_valid_actions()],
        "is_terminal": is_terminal,
        "utility": float(state.terminal_utility()) if is_terminal else None,
        "current_turn": int(state.fill_num)
    }

    # If game not over, make computer move
    if not is_terminal:
        state, computer_action = make_computer_move(session_data)
        is_terminal = bool(state.is_terminal())
        response_data["state"] = state.to_dict()
        response_data["valid_actions"] = [list(a) for a in state.get_all_valid_actions()]
        response_data["is_terminal"] = is_terminal
        response_data["utility"] = float(state.terminal_utility()) if is_terminal else None
        response_data["current_turn"] = int(state.fill_num)
        response_data["computer_action"] = list(computer_action)

    return jsonify(convert_to_serializable(response_data))


def make_computer_move(session_data):
    """Make computer move and return updated state and action"""
    state = session_data["state"]
    agent = session_data["agent"]

    start_time = time.time()
    action = agent.choose_action(state.clone())
    end_time = time.time()

    # Fallback to random if timeout or invalid
    if (end_time - start_time) > 3 or not state.is_valid_action(action):
        action = get_random_valid_action(state._state)

    state = state.change_state(action)
    session_data["state"] = state

    return state, action


@app.route("/api/state", methods=["GET"])
def get_state():
    """Get current game state"""
    game_id = request.args.get("game_id")
    session_data = sessions.get(game_id)
    if not session_data:
        return jsonify({"error": "Invalid game ID"}), 404

    state = session_data["state"]
    is_terminal = bool(state.is_terminal())
    return jsonify(convert_to_serializable({
        "state": state.to_dict(),
        "valid_actions": [list(a) for a in state.get_all_valid_actions()],
        "is_terminal": is_terminal,
        "utility": float(state.terminal_utility()) if is_terminal else None,
        "current_turn": int(state.fill_num),
        "human_fill": int(session_data["human_fill"])
    }))


@app.route("/api/reset", methods=["POST"])
def reset_game():
    """Reset an existing game"""
    data = request.json
    game_id = data.get("game_id")
    player_choice = data.get("player", 1)

    if game_id and game_id in sessions:
        del sessions[game_id]

    # Start new game
    return start_game()


if __name__ == "__main__":
    print("Starting Ultimate Tic Tac Toe Flask Server...")
    print("API available at http://localhost:5000")
    app.run(debug=True, port=5000)
