var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var lastId = 0;
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

function Server() {
  this.users = [];
}
Server.prototype = {
  addUser: function (user) {
    this.users.push(user);
  },
  removeUser: function (userName) {
    this.users = this.users.filter(function (t) {
      return t.name != userName
    });
  },
}
var chat = new Server();
io.on('connection', function (client) {
  console.log('User connected');
  client.on('join', function (user) {
    console.log(user.name + ' joined the chat');
    io.emit('chat message', user.name + ' joined the chat');
    var x = client.request.connection.remoteAddress;
    x = x.replace(/^.*:/, '');
    user.id = x;
    client.emit('addUser', {
      id: user.id,
      name: user.name
    });
    client.broadcast.emit('addUser', {
      id: user.id,
      name: user.name
    });
    chat.addUser({
      id: user.id,
      name: user.name
    });
  });
  client.on('leave', function (userName) {
    console.log(userName + ' has left the game');
    chat.removeUser(userName);
    io.emit('chat message', userName + ' left the chat');
    client.broadcast.emit('removeUser', userName);
  });
  client.on('chat message', function (msg, userName) {
    if (msg == ':)')
      io.emit('chat message', userName + ': <img src="http://www.gify.net/data/media/1894/kciuk-emotikon-ruchomy-obrazek-0001.gif">');
    else
      io.emit('chat message', userName + ":  " + msg);
  });
});
http.listen(3000, function () {
  console.log('listening on *:3000');
});
