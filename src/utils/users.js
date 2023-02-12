const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room, score}) => {
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

    //Check existing users in the room (max = 6)
    numUsersInRoom = users.filter((user) => {
        return user.room === room
    }).length
    //console.log(numUsersInRoom)
    if(numUsersInRoom === 6){
        return {
            error: 'Room is full'
        }
    }

    //Store the user
    const user = {
        id,
        username,
        room,
        score
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