var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var user = [];
var friends = [];

server.listen(process.env.PORT || 5000);
console.log('server running in port ');
app.get('/',(req , res)=>{
   res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',(socket)=>{
    friends.push(socket);
    console.log('connected : %s sockets connected',friends.length);

    socket.on('disconnect',(data)=>{
     friends.splice(friends.indexOf(socket), 1);
     console.log('Disconected : %s sockets connected',friends.length);
    });
    
    socket.on('send message',(data)=>{
     io.sockets.emit('new message',{msg: data});
    });
});
