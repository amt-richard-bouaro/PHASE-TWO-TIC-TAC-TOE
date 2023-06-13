
// $(document).ready(function () {
// 	// Default screen load
// 	let game_config = localStorage.getItem("game_config");
        
// 	if (!game_config) {
// 		localStorage.setItem("game_config", JSON.stringify({ game_on: false }));
// 	} else {
// 		game_config = JSON.parse(localStorage.getItem("game_config"));
// 		if (game_config.game_on) {
// 			$("#game-board").toggleClass("d-none");
// 			$("#new-game").toggleClass("d-none");
// 		}
// 	}

// 	$("#select-player-x").click(e => {
// 		e.preventDefault();

// 		$("#select-player-x").addClass("player-selected");
// 		$("#select-player-o").removeClass("player-selected");
// 		// $("#whichPlayer").text("2");
// 	});

// 	$("#select-player-o").click(e => {
// 		e.preventDefault();
// 		$("#select-player-o").addClass("player-selected");
// 		$("#select-player-x").removeClass("player-selected");
// 		// $("#whichPlayer").text("1");
// 	});
// });
