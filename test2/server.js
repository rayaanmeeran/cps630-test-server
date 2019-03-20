var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var numofUsers = 0;
var usernames = {};
var connections = [];
var numOfRooms = 0;
var team = 0;


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
        io.sockets.adapter.rooms[newRoom].isUpdated = false;

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

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) { // SOCKET.ID IS UNIQE TO EACH PERSON
    numofUsers++;
    connections.push(socket);
    socket.points = 0;
    updateUsers(socket);
    var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id])[0];
    //  console.log(numClients);

    socket.on('disconnect', function() {
        numofUsers--;
        connections.splice(connections.indexOf(socket), 1);
        //console.log("Disconnected: Num of people " + connections.length + " In numOfRooms "+numOfRooms+" is: "+ conInCurRoom);

    });


    socket.on('chat message', function(msg) {
        io.to(currentRoom).emit('chat message', msg, socket.team);
        usernames[socket.id] = msg;
        io.sockets.adapter.rooms[currentRoom].isUpdated = false;
        //console.log("  numOfRooms: "+ currentRoom + " words are " +  io.sockets.adapter.rooms[currentRoom].words);
    });


    socket.on('correct', function(msg) { // DIVIDE BY NUMBER OF PEOPLE IN ROOM

        if (!io.sockets.adapter.rooms[currentRoom].isUpdated)
            if (parseInt(msg) === 1) {
                io.sockets.adapter.rooms[currentRoom].points1 += 1 / 2;
            } else if (parseInt(msg) === 2) {
            io.sockets.adapter.rooms[currentRoom].points2 += 1 / 2;
        }
        io.sockets.adapter.rooms[currentRoom].isUpdated = true;

        socket.emit('updateScore', io.sockets.adapter.rooms[currentRoom].points1, io.sockets.adapter.rooms[currentRoom].points2);

        console.log("Socket on team " + socket.team + " has " + socket.points + "points\n" + " Team 1: " + io.sockets.adapter.rooms[currentRoom].points1 + " Team 2: " + io.sockets.adapter.rooms[currentRoom].points2);
    });

    socket.on('setArr', function(newWords) {
        io.sockets.adapter.rooms[currentRoom].words = newWords;
        io.to(currentRoom).emit('sentNewArray', io.sockets.adapter.rooms[currentRoom].words);
        //console.log("  numOfRooms: "+ currentRoom + " words are " +  io.sockets.adapter.rooms[currentRoom].words);
    });



});




http.listen(port, function() {
    console.log('listening on *:' + port);
});