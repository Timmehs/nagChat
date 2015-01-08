(function(rootObject) {
  var NagChat = rootObject.NagChat = rootObject.NagChat || {};

  var Chat = NagChat.Chat = function(socket) {
    this.socket = socket;
  }

  Chat.prototype.sendMessage = function(opts) {
    this.socket.emit('message', {user: opts.user, text: opts.text} );
  };


})(this);
