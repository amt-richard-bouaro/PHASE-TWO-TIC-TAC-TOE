import Game from "./game.js";

// game instance
let game = new Game();

// game states save in localStorage
const gameState = localStorage.getItem("gameState");
let game_config = localStorage.getItem("game_config");

// this targets all the nine slots of the board
const boardSquares = document.getElementsByClassName("board-square");

function saveGameState() {
	localStorage.setItem("gameState", JSON.stringify(game));
}

export const fillBoard = (index, fill) => {
	boardSquares[index].firstElementChild.classList.remove("d-none");
	boardSquares[index].firstElementChild.setAttribute(
		"src",
		`./assets/icon-${fill}.svg`
	);
};

const playerSelection = player => {
	let deSelect = player === "x" ? "o" : "x";
	$(`#select-player-${player}`).addClass("player-selected");
	$(`#select-player-${deSelect}`).removeClass("player-selected");
	game.player1 = player.toUpperCase();
};

export const tieResults = () => {
	$("#game-player-won").addClass("d-none");
	$(".game-winner-msg-text").css("color", "#a8bfc9");
	$(".game-winner-msg-text").text("ROUND TIED");
	$("#winner-img").addClass("d-none");
};

export const showDialog = dialog => {
	$("#game-overlay").toggleClass("d-none");
	$(`${dialog}`).toggleClass("d-none");
};

// on page load

if (!game_config) {
	localStorage.setItem("game_config", JSON.stringify({ game_on: false }));
} else {
	const config = JSON.parse(game_config);
	if (config.game_on) {
		$("#game-board").toggleClass("d-none");
		$("#new-game").toggleClass("d-none");
	}
}

if (gameState === null) {
	saveGameState();
} else {
	const { gameType, board, turn, scoreCard, player1, lastWinner } =
		JSON.parse(gameState);
	game.board = board;
	game.gameType = gameType;
	game.scoreCard = scoreCard;
	game.turn = turn;
	game.player1 = player1;
	game.lastWinner = lastWinner;

	for (let index = 0; index < game.board.length; index++) {
		if (game.board[index] === "X") {
			fillBoard(index, "x");
		} else if (game.board[index] === "O") {
			fillBoard(index, "o");
		}
	}
}

if (
	gameState !== null &&
	game_config !== null &&
	JSON.parse(game_config).game_on
) {
	if (JSON.parse(gameState).gameType === "P2P") {
		p2pGame();
	} else {
		p2cpuGame();
	}
}

//hover effect on slots/grid boxes

for (let index = 0; index < game.board.length; index++) {
	boardSquares[index].addEventListener("mouseenter", e => {
		if (game.board[index] === "") {
			let turn = game.turn === "X" ? "x" : "o";
			if (game.gameType === "P2P") {
				
			e.target.firstElementChild.setAttribute(
				"src",
				`./assets/icon-${turn}-outline.svg`
			);
			e.target.firstElementChild.classList.remove("d-none");
			} else {
				if (game.player1 === game.turn) {
				e.target.firstElementChild.setAttribute(
					"src",
					`./assets/icon-${turn}-outline.svg`
					);	
					e.target.firstElementChild.classList.remove("d-none");
				}
			}
			
		}
	});

	boardSquares[index].addEventListener("mouseleave", e => {
		if (game.board[index] === "") {
			e.target.firstElementChild.setAttribute("src", "");
			// e.target.firstElementChild.classList.add("d-none");
		}
	});
}

if (game.checkWin(game.board)) {
	showDialog("#game-result");
	playerWinsResult();
} else if (game.board.every(idx => idx !== "")) {
	showDialog("#game-result");
	tieResults();
}

$("#select-player-x").click(e => {
	e.preventDefault();
	playerSelection("x");
	saveGameState();
	updatePlayerScore();
});

$("#select-player-o").click(e => {
	e.preventDefault();
	playerSelection("o");
	saveGameState();
	updatePlayerScore();
});

const clearGameState = () => {
	localStorage.setItem("game_config", JSON.stringify({ game_on: false }));

	game.board = Array(9).fill("");
	game.gameType = "";
	game.scoreCard = { playerX: 0, playerO: 0, ties: 0 };
	game.turn = "X";
	game.player1 = "X";

	for (let index = 0; index < 9; index++) {
		boardSquares[index].firstElementChild.classList.add("d-none");
		boardSquares[index].firstElementChild.setAttribute("src", "");
	}

	localStorage.setItem("gameState", JSON.stringify(game));
	playerSelection("x");
	$("#game-board").toggleClass("d-none");
	$("#new-game").toggleClass("d-none");
};

const switchToGame = () => {
	$("#game-board").toggleClass("d-none");
	$("#new-game").toggleClass("d-none");
	let game_config = JSON.parse(localStorage.getItem("game_config"));
	localStorage.setItem(
		"game_config",
		JSON.stringify({ ...game_config, game_on: !game_config.game_on })
	);
};

const toggleRestartWindow = () => {
	const overlay = document.getElementById("game-overlay");
	const restartGame = document.getElementById("restart-game");
	overlay.classList.toggle("d-none");
	restartGame.classList.toggle("d-none");
};

function updatePlayerScore() {
	const px = () => {
		if (game.gameType === "P2CPU") {
			return game.player1 === "X" ? "You" : "CPU";
		} else {
			return game.player1 === "X" ? "P1" : "P2";
		}
	};

	$("#p-x-score").text(game.scoreCard.playerX);
	$("#player-x").text(px());
	$("#ties-score").text(game.scoreCard.ties);

	const po = () => {
		if (game.gameType === "P2CPU") {
			return game.player1 === "O" ? "You" : "CPU";
		} else {
			return game.player1 === "O" ? "P1" : "P2";
		}
	};

	$("#p-o-score").text(game.scoreCard.playerO);
	$("#player-o").text(po());
}
// console.log(game);
updatePlayerScore();

const restartCancel = document.getElementById("btn-cancel-restart");
restartCancel.addEventListener("click", () => {
	toggleRestartWindow();
});

const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", () => {
	toggleRestartWindow();
});

const restartConfirmed = document.getElementById("btn-confirm-restart");
restartConfirmed.addEventListener("click", () => {
	clearGameState();
	toggleRestartWindow();
	window.location.reload();
});

const quit = document.getElementById("btn-quit-game");
quit.addEventListener("click", () => {
	clearGameState();
	showDialog("#game-result");
	window.location.reload();
});

const nextRound = document.getElementById("btn-next-round");
nextRound.addEventListener("click", () => {
	game.board = Array(9).fill("");
	game.turnStart = game.turnStart === "X" ? "O" : "X";
	game.turn = game.turnStart;
	game.lastWinner = "";
	saveGameState();
	updatePlayerScore();

	game.turn === "X"
		? $(".x-turn").removeClass("d-none") && $(".o-turn").addClass("d-none")
		: $(".x-turn").addClass("d-none") && $(".o-turn").removeClass("d-none");

	for (let index = 0; index < 9; index++) {
		boardSquares[index].firstElementChild.classList.add("d-none");
		boardSquares[index].firstElementChild.setAttribute("src", "");
	}
	if (game.gameType === "P2CPU") {
		p2cpuGame();
	}

	showDialog("#game-result");
});

const P2P = document.getElementById("newGameWithPlayer");
P2P.addEventListener("click", () => {
	switchToGame();
	game.gameType = "P2P";
	saveGameState();
	updatePlayerScore();
	p2pGame();
});

const P2CPU = document.getElementById("newGameWithCPU");
P2CPU.addEventListener("click", () => {
	switchToGame();
	game.gameType = "P2CPU";
	saveGameState();
	updatePlayerScore();
	p2cpuGame();
});

function cpuMove(board) {
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

	if (board.every(slot => slot === "")) {
		return Math.ceil(Math.random() * 8);
	} else {
		for (let possibility of winPossibilities) {
			const [pot1, pot2, pot3] = possibility;
			if (
				board[pot1] === board[pot2] &&
				board[pot1] !== "" &&
				board[pot3] === ""
			) {
				return pot3;
			} else if (
				board[pot2] === board[pot3] &&
				board[pot2] !== "" &&
				board[pot1] === ""
			) {
				return pot1;
			} else if (
				board[pot1] === board[pot3] &&
				board[pot1] !== "" &&
				board[pot2] === ""
			) {
				return pot2;
			}
		}

		let emptySlots = [];
		board.map((slot, index) => {
			if (slot === "") {
				emptySlots.push(index);
			}
		});

		return emptySlots[Math.floor(Math.random() * emptySlots.length)];
	}
}
function p2pGame() {
	console.log("P2P");
	const gameState = JSON.parse(localStorage.getItem("gameState"));
	if (gameState.gameType === "P2P") {
		for (let index = 0; index < boardSquares.length; index++) {
			boardSquares[index].addEventListener("click", () => {
				game.makeMove(index);
				saveGameState();
				// console.log(game);
				game.turn === "X"
					? $(".x-turn").removeClass("d-none") &&
					  $(".o-turn").addClass("d-none")
					: $(".x-turn").addClass("d-none") &&
					  $(".o-turn").removeClass("d-none");
			});
		}
	}
}

function p2cpuGame() {
	const gameState = JSON.parse(localStorage.getItem("gameState"));
	if (gameState.gameType === "P2CPU") {
		if (game.board.every(slot => slot === "") && game.turn !== game.player1) {
			const move = cpuMove(game.board);
			game.makeMove(move);
			saveGameState();
		}

		for (let index = 0; index < boardSquares.length; index++) {
			boardSquares[index].addEventListener("click", () => {
				if (game.turn === game.player1) {
					game.makeMove(index);
					saveGameState();
					game.turn === "X"
						? $(".x-turn").removeClass("d-none") &&
						  $(".o-turn").addClass("d-none")
						: $(".x-turn").addClass("d-none") &&
						  $(".o-turn").removeClass("d-none");

					if (game.turn !== game.player1) {
						const move = cpuMove(game.board);
						setTimeout(() => {
							game.makeMove(move);
							saveGameState();
							game.turn === "X"
								? $(".x-turn").removeClass("d-none") &&
								  $(".o-turn").addClass("d-none")
								: $(".x-turn").addClass("d-none") &&
								  $(".o-turn").removeClass("d-none");
						}, 1000);
					}
				}
			});
		}
	}
}
export function playerWinsResult() {
	const winnerImg = game.lastWinner === "X" ? "x" : "o";
	const color = game.lastWinner === "X" ? "#31c3bd" : "#f2b137";
	let text = "";
	if (game.gameType === "P2P") {
		text =
			game.lastWinner === game.player1 ? "Player 1 wins!" : "Player 2 wins!";
	} else if (game.gameType === "P2CPU") {
		text =
			game.lastWinner !== game.player1 ? "Oh no, you lost..." : "You won!";
	}

	console.log(game.lastWinner);
	$("#game-player-won").removeClass("d-none");
	$("#game-player-won").text(text);

	$(".game-winner-msg-text").css("color", color);
	$(".game-winner-msg-text").text("Takes the round");

	$("#winner-img").removeClass("d-none");
	$("#winner-img").attr("src", `./assets/icon-${winnerImg}.svg`);
}



