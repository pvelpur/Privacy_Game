games = [];


const createNewGame = (user) =>{
    const existingGame = games.find((game) => {
        return game.room === user.room
    })
    if(existingGame){
        return {
            error: 'Game already exists; Cannot create'
        }
    }
    const game = {
        room: user.room,
        users: [{
            username: user.username,
            score: 0,
            numY: null,
            optionYN: null
        }]
    }
    games.push(game);
    return {game}
}

const addUserToGame = (user) => {
    const foundGame = games.find((game) => {
        return game.room === user.room
    })
    if(!foundGame){
        return {
            error: 'Game not found, please create new game'
        }
    }
    //Check existing users in the room (max = 6)
    numUsersInRoom = foundGame.users.length
    //console.log("NUM USERS " + numUsersInRoom)
    if(numUsersInRoom === 6){
        return {
            error: 'Room is full'
        }
    }
    foundGame.users.push({
        username:user.username, 
        score:0, 
        numY: null,
        optionYN: null
    })
    return {game : foundGame}
}

//Remove user from game 
const removeUserFromGame = (player) => {
    const userGame = games.find((game) =>{ return game.room === player.room })
    //if userGame doesn't exist
    if(!userGame){
        return;
    }
    const userIndex = userGame.users.findIndex((user) => user.username === player.username)

    //Found a user
    if(userIndex !== -1){
        //start index and how many we want to remove
        userGame.users.splice(userIndex, 1)[0]
    }

    //TODO: Add logic to check if users array is empty
    if(userGame.users.length === 0){
        games.splice(games.findIndex((game) => {game.room === userGame.room}), 1)[0]
    }
}

//Set user values from the UI (Y/N and numYes)
const setUserValues = (player, optionYN, numY) => {
    const game = games.find((game) => {
        return game.room === player.room
    })
    game.users.map(obj => {
        if(obj.username == player.username){
            obj.optionYN = optionYN
            obj.numY = numY;
        }
        return obj
    })
}

//Set all values to null
const clearAllUserValues = (room) => {
    const game = games.find((game) => {return game.room === room})
    if(game){
        console.log("here")
        game.users.map((user)=> {
                user.optionYN = null;
                user.numY = null;
                return user
            })
    }
}

//TODO: implement 

//Testing
//console.log(createNewGame({room:"room", username:"user1"}).game);
//console.log(addUserToGame({username: "paul", room: "room2"}).error)
//console.log(addUserToGame({username: "paul", room: "room"}).game)
// console.log("REMOVING")
// removeUserFromGame({username: "user1", room: "room"})
// removeUserFromGame({username: "paul", room: "room"})
// console.log(games[0].users)
//Test 'setUserValues'
// setUserValues({username:"paul", room:"room"}, 'Y', 4)
// console.log(games[0].users)
// Test clearAllUserValues
//clearAllUserValues("room");
//console.log(games[0].users)



module.exports = {
    createNewGame,
    addUserToGame,
    removeUserFromGame,
    setUserValues,
    clearAllUserValues
}