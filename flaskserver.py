from flask import Flask, request, jsonify, session
from flask_cors import CORS
from agent import StudentAgent
from agent3 import StudentAgent3
from utils import State, get_random_valid_action
import time
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a strong secret key
CORS(app)

# Store multiple sessions (if needed)
sessions = {}

@app.route("/start", methods=["POST"])
def start_game():
    data = request.json
    player_choice = data.get("player")  # 1 or 2

    game_id = str(uuid.uuid4())
    state = State(fill_num=1)

    session_data = {
        "state": state,
        "human_fill": player_choice,
        "computer_fill": 3 - player_choice,
        "agent": StudentAgent() if player_choice == 1 else StudentAgent3()
    }

    sessions[game_id] = session_data

    return jsonify({
        "game_id": game_id,
        "message": "Game started",
        "player": player_choice,
        "state": state.to_dict()
    })


@app.route("/move/human", methods=["POST"])
def human_move():
    data = request.json
    game_id = data.get("game_id")
    action = tuple(data.get("action"))  # (super_row, super_col, local_row, local_col)

    session_data = sessions.get(game_id)
    if not session_data:
        return jsonify({"error": "Invalid game ID"}), 404

    state = session_data["state"]

    if not state.is_valid_action(action):
        return jsonify({"error": "Invalid move"}), 400

    state = state.change_state(action)
    session_data["state"] = state

    return jsonify({
        "message": "Human move applied",
        "state": state._state,
        "is_terminal": state.is_terminal(),
        "utility": state.terminal_utility() if state.is_terminal() else None
    })


@app.route("/move/ai", methods=["POST"])
def computer_move():
    data = request.json
    game_id = data.get("game_id")

    session_data = sessions.get(game_id)
    if not session_data:
        return jsonify({"error": "Invalid game ID"}), 404

    state = session_data["state"]
    if state.is_terminal():
        return jsonify({"error": "Game already over"}), 400

    agent = session_data["agent"]

    start_time = time.time()
    action = agent.choose_action(state.clone())
    end_time = time.time()

    if (end_time - start_time) > 3 or not state.is_valid_action(action):
        action = get_random_valid_action(state._state)

    state = state.change_state(action)
    session_data["state"] = state

    return jsonify({
        "message": "AI move applied",
        "action": action,
        "state": state._state,
        "is_terminal": state.is_terminal(),
        "utility": state.terminal_utility() if state.is_terminal() else None
    })


@app.route("/state", methods=["GET"])
def get_state():
    game_id = request.args.get("game_id")
    session_data = sessions.get(game_id)
    if not session_data:
        return jsonify({"error": "Invalid game ID"}), 404

    state = session_data["state"]
    return jsonify({
        "state": state._state,
        "is_terminal": state.is_terminal(),
        "utility": state.terminal_utility() if state.is_terminal() else None
    })


if __name__ == "__main__":
    app.run(debug=True)
