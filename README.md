# 🧠 Ultimate Tic Tac Toe: Human vs Agent

Play an enhanced version of Tic Tac Toe against a smart machine learning agent — Ultimate Tic Tac Toe!  
This game features a 9x9 board with local and global strategy, and a simple GUI built using Python's Tkinter.

---

## 🎮 How to Play

Ultimate Tic Tac Toe is played on a 3x3 grid of 3x3 local boards:

- You make moves in one of the 81 cells.
- Your move determines which local board your opponent must play in next.
- Win local boards by getting 3 in a row.
- Win the game by claiming 3 local boards in a row (global win).

---

## 🆚 Human vs Agent

The game lets you play against a **StudentAgent**:

- You can choose to play as **X** (Player 1) or **O** (Player 2) at the start.
- The board highlights the valid local boards based on the previous move.
- The computer uses a decision-making agent to select its moves.
- The game automatically disables input and announces the result (win/lose/draw) when it ends.

---

## ▶️ Running the Game

### 🐍 Option 1: Run with Python (for development)

Ensure you have **Python 3** installed.  
To start the game:

```bash
python ui.py

### 💻 Option 2: Run the Executable (Windows only)

You can download the pre-built `.exe` file and run it directly on a Windows machine — **no Python installation required**.

1. Download the `.exe` file in releases
2. Double-click the file to launch the game.

> 📝 If Windows shows a security warning (e.g., “Windows protected your PC”), click **More info** → **Run anyway**.

Alternatively, you can run it from PowerShell or Command Prompt:

```powershell
.\ui.exe

