(function(rootObject) {
  var NagChat = rootObject.NagChat = rootObject.NagChat || {};

  var Chat = NagChat.Chat = function(socket) {
    this.socket = socket;
  }

  Chat.prototype.sendMessage = function(msg) {
    this.socket.emit('message', msg);
  };


})(this);
