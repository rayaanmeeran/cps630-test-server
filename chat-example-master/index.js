var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var numofUsers=0;
var usernames={};
var room='';



function updateUsers(socket) {
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

}


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){ // SOCKET.ID IS UNIQE TO EACH PERSON

   numofUsers++;
  // console.log( numofUsers + " people have joined"); //socket.id is uniqe id  usernames[socket.id] is set name for unique socket
    
  socket.on('chat message', function(msg){
    io.emit('chat message', msg); 
    usernames[socket.id]=msg;  
  });


  updateUsers(socket);

  console.log(numofUsers +"  room: "+ room + " val is " +  io.sockets.adapter.rooms[room].var);

  socket.on('disconnect', function() { numofUsers--; 
    });


  

});




http.listen(port, function(){
  console.log('listening on *:' + port);
});
