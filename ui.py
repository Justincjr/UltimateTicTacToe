from agent import StudentAgent
from utils import State, Action, get_random_valid_action
import tkinter as tk
from tkinter import messagebox
import time

class UltimateTicTacToeUI:
    def __init__(self, student_agent: StudentAgent, start_fill=1):
        self.student_agent = student_agent
        self.human_fill = 1    # Human plays as 1 ("X")
        self.computer_fill = 2 # Computer plays as 2 ("O")
        self.state = State(fill_num=start_fill)
        
        self.root = tk.Tk()
        self.root.title("Ultimate Tic Tac Toe: Human vs StudentAgent")
        
        # Create frame for the 9x9 board grid.
        self.board_frame = tk.Frame(self.root)
        self.board_frame.grid(row=0, column=0, padx=10, pady=10)
        
        # Message label for turn updates / game result.
        self.message_label = tk.Label(self.root, text="Your turn", font=("Arial", 14))
        self.message_label.grid(row=1, column=0, pady=10)
        
        # Create a 9x9 grid of buttons.
        self.buttons = [[None for _ in range(9)] for _ in range(9)]
        for i in range(9):
            for j in range(9):
                # Compute adjusted grid row/column index with separators
                grid_row = i + (i // 3)
                grid_col = j + (j // 3)

                btn = tk.Button(
                    self.board_frame,
                    width=4, height=2,
                    font=("Arial", 12),
                    command=lambda i=i, j=j: self.on_cell_clicked(i, j)
                )
                btn.grid(row=grid_row, column=grid_col)
                self.buttons[i][j] = btn

        # Add horizontal separators after rows 2 and 5
        for sep_row in [3, 7]:
            separator = tk.Frame(self.board_frame, height=2, bg="black")
            separator.grid(row=sep_row, column=0, columnspan=11, sticky="we")

        # Add vertical separators after cols 2 and 5
        for sep_col in [3, 7]:
            separator = tk.Frame(self.board_frame, width=2, bg="black")
            separator.grid(row=0, column=sep_col, rowspan=11, sticky="ns")

        
        self.update_ui()
    
    def get_action_from_coords(self, global_row, global_col) -> Action:
        # Compute the corresponding action tuple from global board coordinates.
        super_row = global_row // 3
        super_col = global_col // 3
        local_row = global_row % 3
        local_col = global_col % 3
        return (super_row, super_col, local_row, local_col)
    
    def update_ui(self):
        # If the game is over, disable all buttons and display the result.
        if self.state.is_terminal():
            for row in self.buttons:
                for btn in row:
                    btn.config(state="disabled")
            util = self.state.terminal_utility()
            if util == 1.0:
                msg = "You win!"
            elif util == 0.0:
                msg = "You lose!"
            else:
                msg = "Draw!"
            self.message_label.config(text=msg)
            return

        valid_actions = self.state.get_all_valid_actions()
        valid_boards = set((a[0], a[1]) for a in valid_actions)  # Set of (super_row, super_col)

        for i in range(9):
            for j in range(9):
                action = self.get_action_from_coords(i, j)
                super_row, super_col, local_row, local_col = action
                cell_value = self.state.board[super_row][super_col][local_row][local_col]

                # Set text
                text = "X" if cell_value == 1 else "O" if cell_value == 2 else ""
                self.buttons[i][j].config(text=text)

                # Background color based on board validity
                if (super_row, super_col) in valid_boards:
                    bg = "lightyellow" if cell_value == 0 else "white"
                else:
                    bg = "SystemButtonFace"  # default color

                self.buttons[i][j].config(bg=bg)

                # Enable/disable logic
                if cell_value != 0:
                    self.buttons[i][j].config(state="disabled")
                elif self.state.fill_num == self.human_fill and action in valid_actions:
                    self.buttons[i][j].config(state="normal")
                else:
                    self.buttons[i][j].config(state="disabled")

        if self.state.fill_num == self.human_fill:
            self.message_label.config(text="Your turn")
        else:
            self.message_label.config(text="Computer is thinking...")
            self.root.after(500, self.computer_move)

    
    def on_cell_clicked(self, i, j):
        # Process a human click only if it's the human's turn.
        if self.state.fill_num != self.human_fill:
            return
        action = self.get_action_from_coords(i, j)
        if not self.state.is_valid_action(action):
            messagebox.showerror("Invalid Move", "That move is not valid!")
            return
        self.state = self.state.change_state(action)
        self.update_ui()
    
    def computer_move(self):
        # If game is over or not computer's turn, do nothing.
        if self.state.is_terminal() or self.state.fill_num != self.computer_fill:
            return
        start_time = time.time()
        action = self.student_agent.choose_action(self.state.clone())
        end_time = time.time()
        if end_time - start_time > 3:
            messagebox.showinfo("Timeout", "Computer move took too long; choosing a random valid move.")
            action = get_random_valid_action(self.state._state)
        if not self.state.is_valid_action(action):
            messagebox.showerror("Agent Error", "Computer selected an invalid move; choosing a random valid move.")
            action = get_random_valid_action(self.state._state)
        self.state = self.state.change_state(action)
        self.update_ui()
    
    def run(self):
        self.root.mainloop()


# =================== Main ===================
if __name__ == "__main__":
    print("starting ......")
    student_agent = StudentAgent()
    print("student_agent initialized")
    # Start with fill_num=1 so that the human goes first.
    ui = UltimateTicTacToeUI(student_agent, start_fill=1)
    print("calling run")
    ui.run()