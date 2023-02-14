const createGameBtn = document.getElementById("createGameBtn");
const joinGameBtn = document.getElementById("joinGameBtn");
const username = document.getElementById("username");
const room = document.getElementById("room");

  createGameBtn.addEventListener("click", function(event) {
    event.preventDefault();

    //console.log(username)
    if(username.value === "" || room.value === ""){
        alert("Display Name and Room Name are Required!")
    }
    else {
        // Check if there is already and existing game

        window.location.href = `game.html?username=${username.value}&room=${room.value}&type=create`
    }
  });

  joinGameBtn.addEventListener("click", function(event) {
    event.preventDefault();
    if(username.value === "" || room.value === ""){
        alert("Display Name and Room Name are Required!")
    }
    // Redirect to another HTML page
    window.location.href = `game.html?username=${username.value}&room=${room.value}&type=join`;
  });