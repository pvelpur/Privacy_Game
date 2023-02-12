const socket = io()

//Elements


//Templates
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
//object destructuring
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    alert(message);
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

//server will listen for new joins
socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = './'
    }
})