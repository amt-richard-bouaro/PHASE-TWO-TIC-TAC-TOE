$(document).ready(function () { 


    $("#select-player-x").click((e) => {
        e.preventDefault();
       
        $("#select-player-x").addClass("player-selected");
        $("#select-player-o").removeClass("player-selected");
        $("#whichPlayer").text("2");

        
    })

    $("#select-player-o").click((e) => {
          e.preventDefault();
        $("#select-player-o").addClass("player-selected");
        $("#select-player-x").removeClass("player-selected");
        $("#whichPlayer").text("1");
		});


    
    
    


})

