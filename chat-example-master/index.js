var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var numofUsers = 0;
var usernames = {};
var room = '';


function updateUsers(socket) {
room = parseInt(numofUsers/3).toString();
socket.join(room);
/*
  if (numofUsers===1) {
    socket.join('1');
    io.sockets.adapter.rooms['1'].var = 'fdsfds';
    room='1';
  }

  else  {
    socket.join('2');
    io.sockets.adapter.rooms['2'].var = 'ldldl';
    room='2';
  }
*/

}


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){ // SOCKET.ID IS UNIQE TO EACH PERSON
   numofUsers++;
  updateUsers(socket);

  socket.on('disconnect', function() { numofUsers--; });

  var currentRoom=Object.keys( io.sockets.adapter.sids[socket.id])[0];
  var conInCurRoom =  io.sockets.adapter.rooms[currentRoom].length;

console.log("Num of people " + numofUsers + " In room "+room+" is: "+ conInCurRoom);
  
if (conInCurRoom===2) { // If tehre are two people in the room start.
  io.to(currentRoom).emit('start');
}
else {
  io.to(currentRoom).emit('not ready');
}

  
  socket.on('chat message', function(msg){
    io.to(currentRoom).emit('chat message', msg); 
    usernames[socket.id]=msg;  
    //console.log("  room: "+ currentRoom + " words are " +  io.sockets.adapter.rooms[currentRoom].words);
  });



socket.on('setArr', function(newWords) {
io.sockets.adapter.rooms[currentRoom].words=newWords;
io.to(currentRoom).emit('sentNewArray',io.sockets.adapter.rooms[currentRoom].words);
console.log("  room: "+ currentRoom + " words are " +  io.sockets.adapter.rooms[currentRoom].words);
});


 
});




http.listen(port, function() {
    console.log('listening on *:' + port);
});