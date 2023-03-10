const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate username
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }


    //Store the user
    const user = {
        id,
        username,
        room,
    }

    // TODO: Check number of players in Room (limit to 6)

    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    //Found a user
    if(index !== -1){
        //start index and how many we want to remove
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id == id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// console.log(addUser({id:1, username:'prith', room:'room'}))
// console.log(addUser({id:2, username:'prith2', room:'room'}))
// console.log(getUsersInRoom('room'))