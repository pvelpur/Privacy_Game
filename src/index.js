const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { createNewGame, addUserToGame, 
        removeUserFromGame, clearAllUserValues, 
        setUserValues, getRandomQuestion,
        updatePlayerScores, checkAllUserInput,
        getPlayerScores, getPlayersInRoom
    } = require('./utils/gameLogic')
const { get } = require('https')

const app = express()
const server = http.createServer(app)
const io = socketio(server) //socketio expects the raw http server as input

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    //console.log('New WebSocket connection')

    socket.on('join', ({username, room, type}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room})

        if(error) {
            return callback(error)
        }
        var currGame = null
        if(type === 'create'){
            //add new game with error checking
            const {error, game} = createNewGame(user)
            if(error){
                return callback(error)
            }
            currGame=game;
        }
        else if(type === 'join'){
            //add User To Existing Game with error checking
            const {error, game} = addUserToGame(user)
            if(error){
                return callback(error) //could be game is full or game not found
            }
            currGame=game;
        }
        else{
            return callback({error: 'Unknown Error please retry'})
        }

        socket.join(user.room)

        //server will send only to client that joined
        socket.emit('message', 'Welcome!')
        //socket will send to all others connections in the room
        socket.broadcast.to(user.room).emit('message', `${user.username} has joined!`)
        io.to(user.room).emit('roomData', {
            room: user.room,
            //users: getUsersInRoom(user.room)
            users: currGame.users
        })

        io.to(user.room).emit('waiting', {message: "Waiting for game to start..."})
        
        socket.on('gameStart', ({room}) => {
            io.to(room).emit('getRandomQuestion', getRandomQuestion())
        })

        callback()

        // socket.emit, io.emit, socket.broadcast.emit
        // with rooms:
        // io.to.emit, socket.broadcast.to.emit
    })
    
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            removeUserFromGame(user)
            //io.to(user.room).emit('message', `${user.username} has left!`)
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })

    socket.on('userInput', ({username, room, optionYN, num}, callback) => {
        setUserValues({username, room}, optionYN, num )
        //console.log(`server received ${username}'s input in room ${room}: ${optionYN} and ${num}`)
        callback({success: "User input recorded"})
        if(checkAllUserInput(room)){
            var totalYes = updatePlayerScores(room)
            io.to(room).emit("scoresUpdated", {
                totalYes,
                scores: getPlayerScores(room)
            })
            io.to(room).emit('roomData', {
                room,
                //users: getUsersInRoom(user.room)
                users: getPlayersInRoom(room)
            })
        }
    })
    socket.on('refreshData', ({room}) => {
        clearAllUserValues(room)
        //console.log("data has been refreshed")
        io.to(room).emit('getRandomQuestion', getRandomQuestion())
    })
    
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

