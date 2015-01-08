
var socketio = require('socket.io');

var createChatServer = function (server) {
  var io = socketio.listen(server);

  io.on('connection', function (socket) {
    socket.on('message', function(msg) {
      console.log('received message: ' + msg);
      io.emit('message', {user: msg.user, text: msg.text });
    });

  });
}




module.exports = createChatServer;
