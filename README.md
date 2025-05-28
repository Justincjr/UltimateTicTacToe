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

- Human plays as **X** (1)
- Computer plays as **O** (2)
- The board highlights valid local boards for the current move.
- The computer uses a decision-making agent to select its moves.

---

## ▶️ Running the Game

Ensure you have Python 3 installed.  
To start the game:

```bash
python ui.py
