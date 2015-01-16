
var socketio = require('socket.io');

var log = function (msg) {
  console.log("Server: " + msg);
}


var createChatServer = function (server) {
  var io = socketio.listen(server);
  var guestnumber = 1;
  var nicknames = {};

  io.on('connection', function (socket) {
    newGuest (socket);
    socket.on('message', function(msg) {
      log('received message: ' + msg);
      io.emit('message', {user: msg.user, text: msg.text });
    });

    nicknameHandler(socket, io);

  });


  // Nickname functions
  var newGuest = function (socket) {
    var guest = "Guest " + guestnumber;
    nicknames[socket.id] = guest;
    log('new guest ' + guest);
    guestnumber++;

    socket.broadcast.to(socket.id).emit('connectionResponse', {
      nick : guest
    });
  };

  var nicknameHandler = function (socket, io) {
    var sock = socket;
    socket.on('nickChangeReq', function(data) {
      nicknameChangeResponse(changeNick(data.nick, socket), socket);
    });
  };

  var changeNick = function (name, socket) {
    log('nn change');
    if (name.slice(0, 5).toLowerCase() === 'guest') return false;
    nicknames[socket.id] = name;
    return true;
  };

  var nicknameChangeResponse = function (isValid, socket) {
    log('nn response');
    var name = nicknames[socket.id];
    var msg = isValid ? "New name: " + name : "Names cannot begin with 'Guest'";
    socket.emit('nicknameChangeResult', {
      success: isValid,
      message: msg,
      nick: name
    });
  };
};

module.exports = createChatServer;
