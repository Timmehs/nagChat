(function(rootObject) {

  var NagChat = rootObject.NagChat = (rootObject.NagChat || {});

  var ChatUI = NagChat.ChatUI = function (chat) {
    this.chat = chat;
    this.$chatwindow = $("#chat-window");
    this.$chatForm = $('#chat-form');
    this.$userName = $('#username');
    this.$textField = $('.input-lg');
    this.user = "Anonymous";
    this.$textField.attr("placeholder", "Nagging as '" + this.user + "'");


    this.registerListeners();
  };

  ChatUI.prototype.commands = {
    "nick" : function(ui, name) {
      console.log(name);
      ui.user = name;
      ui.$textField.attr("placeholder", "Nagging as '" + ui.user + "'");
    },
    "changeRoom" : function() { console.log('changeroom'); }
  };

  ChatUI.prototype.registerListeners = function() {
    this.messageListener(this);
    this.submitHandler(this);
  };

  ChatUI.prototype.submitHandler = function(ui) {
    this.$chatForm.on("submit", function(e) {
      e.preventDefault();
      ui.processInput();
    });
  };

  ChatUI.prototype.messageListener = function(ui) {
    this.chat.socket.on('message', function (msg) {
      ui.updateChatWindow(msg);
    });
  };

  ChatUI.prototype.updateChatWindow = function (msg) {
    this.$chatwindow.append(
      "<strong style='color: blue;'>" + msg.user + "</strong>: " + msg.text + "<br>"
    );
  };

  ChatUI.prototype.processInput = function() {
    var messageTxt = $('.input-lg').val();
    if (messageTxt == "") return;

    if (this.isCommand(messageTxt)) {
      this.processCommand(messageTxt);
    } else {
      this.chat.sendMessage({ user: this.user, text: messageTxt } );
    }

    $('.input-lg').val('');
  };

  ChatUI.prototype.processCommand = function(cmd) {
    var full_command = cmd.split('/')[1].split(' ');
    var command = full_command[0];
    var arg = full_command[1];
    if (this.isValidCommand(command)) {
      this.commands[command](this, arg);
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
