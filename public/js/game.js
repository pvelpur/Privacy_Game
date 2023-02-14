const socket = io()

//Elements
const radioOption = document.getElementsByName('QResp')
const numYes = document.getElementsByName('numYes')

//Templates
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
//object destructuring
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })


document.querySelector('form.player-input').addEventListener('submit', function (e) {

    //prevent the normal submission of the form
    e.preventDefault();

    for(i = 0; i < radioOption.length; i++) {
        if(radioOption[i].checked)
            console.log(radioOption[i].value)
    }
    console.log(numYes[0].value)   
});

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