const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { createNewGame, addUserToGame, removeUserFromGame, clearAllUserValues, setUserValues, getRandomQuestion } = require('./utils/gameLogic')

const app = express()
const server = http.createServer(app)
const io = socketio(server) //socketio expects the raw http server as input

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({username, room, type}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room})

        if(error) {
            return callback(error)
        }
        if(type === 'create'){
            //add new game with error checking
            console.log("create new game initiated")
            const {error, game} = createNewGame(user)
            if(error){
                return callback(error)
            }
        }
        else if(type === 'join'){
            //add User To Existing Game with error checking
            console.log("Join new game initiated")
            const {error, game} = addUserToGame(user)
            if(error){
                return callback(error) //could be game is full or game not found
            }
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
            users: getUsersInRoom(user.room)
        })

        io.to(user.room).emit('waiting', {message: "Waiting for game to start..."})
        
        socket.on('gameStart', ({room}) => {
            console.log(room)
            io.to(room).emit('getRandomQuestion', getRandomQuestion())
            //io.to(user.room).emit('getRandomQuestion', getRandomQuestion())
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
        console.log(`server received ${username}'s input in room ${room}: ${optionYN} and ${num}`)
        callback({success: "User input recorded"})
    })
    socket.on('refreshData', ({room}) => {
        clearAllUserValues(room)
    })
    
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

