
var socketio = require('socket.io');


var createChatServer = function (server) {
  var io = socketio.listen(server);
  var guestnumber = 1;
  var nicknames = {};

  io.on('connection', function (socket) {
    newGuest (socket);
    console.log(nicknames);
    socket.on('message', function(msg) {
      console.log('received message: ' + msg);
      io.emit('message', {user: msg.user, text: msg.text });
    });

    nicknameHandler(socket, io);

  });


  // Nickname functions
  var newGuest = function (socket) {
    var guest = "Guest " + guestnumber;
    nicknames[socket.id] = guest;
    console.log('new guest ' + guest);
    guestnumber++;

    socket.emit('connectionResponse', {
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
    console.log('nn change');
    if (name.slice(0, 5).toLowerCase() === 'guest') return false;
    nicknames[socket.id] = name;
    return true;
  };

  var nicknameChangeResponse = function (isValid, socket) {
    console.log('nn response');
    var name = nicknames[socket.id];
    var msg = isValid ? "New name: " + name : "Names cannot begin with 'Guest'";
    socket.emit('nicknameChangeResult', {
      success: isValid,
      message: msg,
      nick: name
    });
  };
}





module.exports = createChatServer;
