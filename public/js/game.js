const socket = io()

//Elements
const radioOption = document.getElementsByName('QResp')
const numYes = document.getElementsByName('numYes')

//Templates
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const questionTemplate = document.querySelector('#question-template').innerHTML

//Options
//object destructuring
const {username, room, type} = Qs.parse(location.search, { ignoreQueryPrefix: true })


document.querySelector('form.player-input').addEventListener('submit', function (e) {

    //prevent the normal submission of the form
    e.preventDefault();

    for(i = 0; i < radioOption.length; i++) {
        if(radioOption[i].checked)
            var optionYN = radioOption[i].value
    }
    //console.log(numYes[0].value)
    var num = numYes[0].value
    socket.emit('userInput', {username, room, optionYN, num})   
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

socket.on('getRandomQuestion', ({ID, question}) => {
    const html = Mustache.render(questionTemplate, {
        question
    })
    document.querySelector('#question').innerHTML = html
})

//server will listen for new joins
socket.emit('join', {username, room, type}, (error) => {
    if(error){
        alert(error)
        location.href = './'
    }
})