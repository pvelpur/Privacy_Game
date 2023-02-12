const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server) //socketio expects the raw http server as input

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({username, room}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room, score: 0 })

        if(error) {
            return callback(error)
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

        callback()

        // socket.emit, io.emit, socket.broadcast.emit
        // with rooms:
        // io.to.emit, socket.broadcast.to.emit
    })
    
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', `${user.username} has left!`)
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

