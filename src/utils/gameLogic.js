games = [];

// //Check existing users in the room (max = 6)
// numUsersInRoom = users.filter((user) => {
//     return user.room === room
// }).length
// //console.log(numUsersInRoom)
// if(numUsersInRoom === 6){
//     return {
//         error: 'Room is full'
//     }
// }

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
            num: null,
            option: null
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
    foundGame.users.push({
        username:user.username, 
        score:0, 
        num: null,
        option: null
    })
    return {foundGame}
}

//Remove user from game 
const removeUserFromGame = (player) => {
    const userGame = games.find((game) =>{ return game.room === player.room })
    //if userGame doesn't exist
    if(!userGame){
        return;
    }
    const index = userGame.users.findIndex((user) => user.username === player.username)

    //TODO: Add logic to check if users array is empty

    //Found a user
    if(index !== -1){
        //start index and how many we want to remove
        return userGame.users.splice(index, 1)[0]
    }
}

//Set user values from the UI (Y/N and numYes)
const setUserValues = () => {

}

//Set all values to null
const clearAllUserValues = () => {

}

//Testing
// console.log(createNewGame({room:"room", username:"user1"}));
// console.log(addUserToGame({username: "paul", room: "room2"}))
// console.log(addUserToGame({username: "paul", room: "room"}))
// console.log(removeUserFromGame({username: "user1", room: "room"}))
// console.log("games " + games)

module.exports = {
    createNewGame,
    addUserToGame,
    removeUserFromGame
}