var lastId = 0;




var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
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
