
var socketio = require('socket.io');

var createChatServer = function (server) {
  var io = socketio.listen(server);

  io.on('connection', function (socket) {
    socket.on('message', function(msg) {
      io.emit('message', msg);
    });

  });
}




module.exports = createChatServer;
