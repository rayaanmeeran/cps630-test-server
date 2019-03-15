var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;

var numofUsers = 0;
var usernames = {};
var room = '';

user = [];
connections = [];

server.listen(port, function() {
    console.log("Server running... / Listening on port: " + port);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) { // SOCKET.ID IS UNIQUE TO EACH PERSON

    connections.push(socket);
    console.log("Connected: Number of sockets = ", connections.length)

    //numofUsers++;
    //console.log( numofUsers + " people have joined"); //socket.id is uniqe id  usernames[socket.id] is set name for unique socket


    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
        usernames[socket.id] = msg;
    });

    //updateUsers(socket);
    //console.log(numofUsers + "  room: " + room + " val is " + io.sockets.adapter.rooms[room].var);

    socket.on('disconnect', function() {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disonnected: Number of sockets = ", connections.length)
    });
});



/*
function updateUsers(socket) {
    if (numofUsers === 1) {
        socket.join('1');
        io.sockets.adapter.rooms['1'].var = 'fdsfds';
        room = '1';
    } else {
        socket.join('2');
        io.sockets.adapter.rooms['2'].var = 'ldldl';
        room = '2';
    }
}
*/