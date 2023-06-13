import { tieResults, showDialog, playerWinsResult } from "./main.js";

const boardSquares = document.getElementsByClassName("board-square");

function Game() {
    let cleanBoard = Array(9).fill("");

	this.gameType = "";
	this.scoreCard = { playerX: 0, playerO: 0, ties: 0 };
	this.board = cleanBoard;
    this.turn = "X";
    this.turnStart = this.turn
    this.player1 = "X";
    this.lastWinner = ""

	this.makeMove = function (slot) {
		if (this.board[slot] === "") {
			if (this.turn === "X") {
				this.board[slot] = "X";

				boardSquares[slot].firstElementChild.classList.remove("d-none");
				boardSquares[slot].firstElementChild.setAttribute(
					"src",
					"./assets/icon-x.svg"
				);

				if (this.checkWin(this.board)) {
					this.scoreCard.playerX += 1;
                     this.lastWinner = "X";
                    playerWinsResult()                  
					showDialog("#game-result");
				} else if (this.board.every(idx => idx !== "")) {
                    this.scoreCard.ties += 1;
                    tieResults();
                    this.lastWinner = ""
					showDialog("#game-result");
				} else {
					this.turn = this.turn === "X" ? "O" : "X";
				}
			} else {
				this.board[slot] = "O";

				boardSquares[slot].firstElementChild.classList.remove("d-none");
				boardSquares[slot].firstElementChild.setAttribute(
					"src",
					"./assets/icon-o.svg"
				);

				if (this.checkWin(this.board)) {
                    this.scoreCard.playerO += 1;
                    this.lastWinner = "O";
					playerWinsResult();
					showDialog("#game-result");
				} else if (this.board.every(idx => idx !== "")) {
                    this.scoreCard.ties += 1;
                    tieResults();
					showDialog("#game-result");
				} else {
					this.turn = this.turn === "X" ? "O" : "X";
				}
			}
		}
	};

	this.checkWin = function (board) {
		const winPossibilities = [
			//rows
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			//columns
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			//diagonals
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let possibility of winPossibilities) {
			const [x, y, z] = possibility;

			if (
				board[x] !== "" &&
				board[x] === board[y] &&
				board[y] === board[z]
			) {
				return true;
			}
		}

		return false;
	};

}

export default Game;
