const io = require('https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.8.0/socket.io.min.js')
const socket = io('http:/localhost:3000')
socket.on('connect', () => {
    console.log("User connected");
})

socket.on('error', (e) => {
    console.log("Error: ",e);
})

socket.on('message', function(data) {
    console.log('Message received: ', data);
});

socket.emit('getsongrequest', socket)

socket.on('getsongrequest', (data) => {
    console.log(data);
})