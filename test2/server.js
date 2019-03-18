var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var numofUsers = 0;
var usernames = {};
var connections = [];
var room = '';
var team = 0;

http.listen(port, function() {
    console.log('\x1b[36m%s\x1b[0m', "Server running..." + "\n" + "Listening on port: " + port); //First part of the console.log sets its color.
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + "/"));

function updateUsers(socket) {
    room = parseInt(connections.length / 3).toString();


    for (let i = 0; i <= room; i++) {
        var clientsInRoom = io.nsps['/'].adapter.rooms[i.toString()];
        var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;


        if (parseInt(numClients) < 2) {
            socket.join(i.toString());



updateUsers(socket);
  

//  console.log(numClients);
  var currentRoom=Object.keys( io.sockets.adapter.sids[socket.id])[0];
  var conInCurRoom =  io.sockets.adapter.rooms[currentRoom].length;

//console.log("Connected: Num of people " + connections.length + " In room "+room+" is: "+ conInCurRoom);
  
if (conInCurRoom===2) { // If tehre are two people in the room start.
  io.to(currentRoom).emit('start');
  io.sockets.adapter.rooms[currentRoom].start=true;
}
else {
  io.to(currentRoom).emit('not ready');
  //io.sockets.adapter.rooms[currentRoom].start=false;
}

//console.log(io.sockets.adapter.rooms[currentRoom].start);  
  socket.on('chat message', function(msg){
    io.to(currentRoom).emit('chat message', msg); 
    usernames[socket.id]=msg;  
    //console.log("  room: "+ currentRoom + " words are " +  io.sockets.adapter.rooms[currentRoom].words);
  });
            var team1 = (team % 2) + 1;
            team++;
            socket.team = team1;

            console.log('\x1b[35m%s\x1b[0m', "In room " + i + " there are " + (numClients + 1) + " people.");
            console.log('\x1b[32m%s\x1b[0m', "Socket team is " + socket.team);
            break;
        }

    }


}

io.on('connection', function(socket) { // SOCKET.ID IS UNIQE TO EACH PERSON
    numofUsers++;
    connections.push(socket);

    updateUsers(socket);

socket.on('setArr', function(newWords) {
io.sockets.adapter.rooms[currentRoom].words=newWords;
io.to(currentRoom).emit('sentNewArray',io.sockets.adapter.rooms[currentRoom].words);
//console.log("  room: "+ currentRoom + " words are " +  io.sockets.adapter.rooms[currentRoom].words);
});

socket.on('disconnect', function() { 
  numofUsers--; 
  connections.splice(connections.indexOf(socket),1);
//console.log("Disconnected: Num of people " + connections.length + " In room "+room+" is: "+ conInCurRoom);
  });
 

    //console.log("Connected: Num of people " + connections.length + " In room "+room+" is: "+ conInCurRoom);

  



}); // END OF IO CONNETION



function updateUsers(socket) {
  room = parseInt(connections.length/3).toString();
  //var currentRoom=Object.keys( io.sockets.adapter.sids[socket.id])[0];
  //console/log(currentRoom.start);
  
  for (let i=0; i<=room; i++) {
    var clientsInRoom = io.nsps['/'].adapter.rooms[i.toString()];
    var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length; 
    var isFull= clientsInRoom === undefined ? false : Object.keys(clientsInRoom).start;
    console.log(isFull);

    if (parseInt(numClients)<2 && !isFull) {
     // var x = io.sockets.adapter.rooms['0'].start;
      socket.join(i.toString());
      var team1 = (team%2)+1;
      team++;
      socket.team=team1;
    //  console.log("In room " + i + " there are " + (numClients+1) + " people " +" \n Socket team is " +socket.team);
      break;
    }
  
  } // END OF FOR
  
  
  } // END OF UPDATE FUNC
    if (conInCurRoom === 2) { // If tehre are two people in the room start.
        io.to(currentRoom).emit('start');
        currentRoom.start = true;
    } else {
        io.to(currentRoom).emit('not ready');
        currentRoom.start = false;
    }


    socket.on('chat message', function(msg) {
        io.to(currentRoom).emit('chat message', msg);
        usernames[socket.id] = msg;
        //console.log("  room: "+ currentRoom + " words are " +  io.sockets.adapter.rooms[currentRoom].words);
    });



    socket.on('setArr', function(newWords) {
        io.sockets.adapter.rooms[currentRoom].words = newWords;
        io.to(currentRoom).emit('sentNewArray', io.sockets.adapter.rooms[currentRoom].words);
        //console.log("  room: "+ currentRoom + " words are " +  io.sockets.adapter.rooms[currentRoom].words);
    });

});