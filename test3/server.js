var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var usernames = {};
var connections = [];
var numOfRooms = 0;
var team = 0;

http.listen(port, function() {
    console.log("Server started..." + "\nListening on port: " + port + "\n");
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

function updateUsers(socket) {
    numOfRooms = parseInt(connections.length / 3);
    var numClients = 0;
    var newRoom;

    for (let i = 0; i <= numOfRooms; i++) {
        var clientsInRoom = io.nsps['/'].adapter.rooms[i.toString()];
        numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
        var started = io.sockets.adapter.rooms[i.toString()];
        var isStarted = started === undefined ? false : io.sockets.adapter.rooms[i.toString()].start;


        if (parseInt(numClients) < 2 && !isStarted) {
            socket.join(i.toString());
            var team1 = (team % 2) + 1;
            team++;
            socket.team = team1;
            newRoom = i.toString();
            //console.log("In numOfRooms " + i + " there are " + (numClients+1) + " people " +" \n Socket team is " +socket.team);
            break;
        }

    }

    /*if (fullRooms===numOfRooms && fullRooms<1) {
      newRoom=(parseInt(newRoom)+1).toString(); 
      numOfRooms++;
      socket.join((newRoom).toString());
      io.to(newRoom).emit('start',newRoom);
      }*/
    if (newRoom === undefined) {
        newRoom = (numOfRooms + 1).toString();
        numOfRooms++;
        socket.join(newRoom);
    }

    clientsInRoom = io.nsps['/'].adapter.rooms[newRoom];
    numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;


    //else {
    if (numClients === 2) { // If tehre are two people in the numOfRooms start.
        io.to(newRoom).emit('start', newRoom);
        io.sockets.adapter.rooms[newRoom].start = true;
        io.sockets.adapter.rooms[newRoom].points1 = 0;
        io.sockets.adapter.rooms[newRoom].points2 = 0;

        console.log(io.sockets.adapter.rooms[newRoom].start);
    } else {
        io.to(newRoom).emit('not ready');
        // io.sockets.adapter.rooms[currentRoom].start=false;
    }
    //} // END OF BIG ELSE

} // END OF FUNC


function wordPoint(word) {
    return word.length * 10;
}

io.on('connection', function(socket) { // SOCKET.ID IS UNIQUE TO EACH PERSON

    var user = new User(socket.id, 0);
    connections.push(user);
    updateUsers(user);

    var currentRoom = Object.keys(io.sockets.adapter.sids[user.id])[0];

    socket.on('disconnect', function() {
        numofUsers--;
        connections.splice(connections.indexOf(socket), 1);

    });

    socket.on('word submit', function(msg) {
        io.to(currentRoom).emit('chat message', msg);
        usernames[socket.id] = msg;
    });

    socket.on('setArr', function(newWords) {
        io.sockets.adapter.rooms[currentRoom].words = newWords;
        io.to(currentRoom).emit('sentNewArray', io.sockets.adapter.rooms[currentRoom].words);
    });

});