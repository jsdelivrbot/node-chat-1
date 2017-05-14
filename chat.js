var localUser = "";

function Users() {
  this.users = [];
}
Users.prototype = {
  addUser: function (user) {
    this.users.push(user);
  },
  removeUser: function (userName) {
    //Remove tank object
    this.users = this.users.filter(function (t) {
      return t.name != userName
    });
    //remove tank from dom
    //$('#' + tankId).remove();
    //$('#info-' + tankId).remove();
  },
}
var chat = new Users();
$(function () {
  var socket = io();
  $(window).on('beforeunload', function () {
    socket.emit('leave', localUser);
  });
  $('form').submit(function () {
    if (localUser != '' && $('#m').val() != '') {
      socket.emit('chat message', $('#m').val(), localUser);
    }
    $('#m').val('');
    return false;
  });
  $('#join').click(function () {
    userName = $('#user-name').val();

    joinChat(userName, socket);
    localUser = userName;
  });
  socket.on('removeUser', function (userName) {
    game.removeUser(userName);
  });
  socket.on('addUser', function (user) {
    chat.addUser(user.id, user.name);
    $('#users').append($('<li>').html(user.id + ", " + user.name));
  });
  socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').html(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
});

function joinChat(userName, socket) {
  if (userName != '') {
    $('.join').fadeOut("slow");
    socket.emit('join', {
      name: userName
    });
  }
}
