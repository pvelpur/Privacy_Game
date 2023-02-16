const socket = io()

//Elements
const radioOption = document.getElementsByName('QResp')
const numYes = document.getElementsByName('numYes')
const startBtn = document.getElementById("StartGame")
const nextRoundBtn = document.getElementById("NextRound")

//Templates
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const questionTemplate = document.querySelector('#question-template').innerHTML

//Options
//object destructuring
var {username, room, type} = Qs.parse(location.search, { ignoreQueryPrefix: true })
username = username.trim().toLowerCase()
room = room.trim().toLowerCase()

if(type === 'join'){
    startBtn.hidden = true;
}
nextRoundBtn.hidden=true;

document.querySelector('form.player-input').addEventListener('submit', function (e) {

    //prevent the normal submission of the form
    e.preventDefault();

    for(i = 0; i < radioOption.length; i++) {
        if(radioOption[i].checked)
            var optionYN = radioOption[i].value
    }
    //console.log(numYes[0].value)
    var num = numYes[0].value
    socket.emit('userInput', {username, room, optionYN, num}, (success) =>{
        if(success) {
            document.getElementById('submit_responses').disabled = true;
        }
    })   
});

startBtn.addEventListener('click', (e) => {
    e.preventDefault()
    //emit game start event
    startBtn.hidden=true
    socket.emit('gameStart', {room})
    
})

//socket.emit('refreshData', {room})

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
    document.getElementById('submit_responses').disabled = false;
})

socket.on('waiting', ({message}) => {
    const html = Mustache.render(questionTemplate, {
        question: message
    })
    document.querySelector('#question').innerHTML = html
    document.getElementById('submit_responses').disabled = true;
})

//server will listen for new joins
socket.emit('join', {username, room, type}, (error) => {
    if(error){
        alert(error)
        location.href = './'
    }
})