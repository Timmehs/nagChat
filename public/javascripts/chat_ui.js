(function(rootObject) {

  var NagChat = rootObject.NagChat = (rootObject.NagChat || {});

  var ChatUI = NagChat.ChatUI = function (chat) {
    this.chat = chat;
    this.$chatwindow = $("#chat-window");
    this.$chatForm = $('#chat-form');
    this.user = "Anonymous Nagger";


    this.registerListeners();
  };

  ChatUI.prototype.commands = {
    "nick" : function() { console.log('changenick'); },
    "changeRoom" : function() { console.log('changeroom'); }
  };

  ChatUI.prototype.registerListeners = function() {
    var ui = this;

    this.chat.socket.on('message', function (msg) {
      ui.$chatwindow.append(msg + "<br>");
      console.log(data);
    });


    ui.$chatForm.on("submit", function(e) {
      e.preventDefault();
      ui.processInput();
    });
  };

  ChatUI.prototype.processInput = function() {
    var messageTxt = $('.input-lg').val();
    if (messageTxt == "") return;

    if (this.isCommand(messageTxt)) {
      this.processCommand(messageTxt);
    } else {
      this.chat.sendMessage(messageTxt);
      $('.input-lg').val('');
    }

  };

  ChatUI.prototype.processCommand = function(cmd) {
    var command = cmd.split('/')[1].split(' ')[0];

    if (this.isValidCommand(command)) {
      this.commands[command]();
    } else {
      console.log('invalid command');
    }
  };

  ChatUI.prototype.isCommand = function(str) {
    return str[0] === "/";
  };

  ChatUI.prototype.isValidCommand = function(cmd) {
    return this.commands.hasOwnProperty(cmd);
  };



})(this);
