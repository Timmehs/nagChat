(function(rootObject) {

  var NagChat = rootObject.NagChat = (rootObject.NagChat || {});

  var ChatUI = NagChat.ChatUI = function (chat) {
    this.chat = chat;
    this.$chatwindow = $("#chat-window");
    this.$chatForm = $('#chat-form');

    this.registerListeners();
  };

  ChatUI.prototype.registerListeners = function() {
    var ui = this;

    this.chat.socket.on('message', function (msg) {
      ui.$chatwindow.append(msg + "<br>");
      console.log(data);
    });


    ui.$chatForm.on("submit", function(e) {
      e.preventDefault();
      var messageTxt = $('.input-lg').val();
      if (messageTxt == "") return;

      ui.chat.sendMessage(messageTxt);
      $('.input-lg').val('');
    });
  }

})(this);
