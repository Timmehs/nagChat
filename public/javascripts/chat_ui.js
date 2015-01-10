(function (rootObject) {

  var NagChat = rootObject.NagChat = (rootObject.NagChat || {});

  var ChatUI = NagChat.ChatUI = function (chat) {
    this.chat = chat;
    this.$chatWindow = $("#chat-window");
    this.$chatText = $('#chat-text');
    this.$chatForm = $('#chat-form');
    this.$userName = $('#username');
    this.$textField = $('.input-field');
    this.user = "Anonymous";
    this.$textField.attr("placeholder", "Nagging as '" + this.user + "'");
    this.commands = {
      "nick" : this.changeNick.bind(this),
      "changeRoom" : function () { console.log('changeroom'); }
    };


    this.registerListeners();
  };

  commands = {
    "nick" : this.changeNick,
    "changeRoom" : function () { console.log('changeroom'); }
  };

  ChatUI.prototype.changeNick = function (nickname) {
    this.chat.changeNick(nickname);
  };

  ChatUI.prototype.connectionListener = function (ui) {
    this.chat.socket.on('connectionResponse', function (res) {
      ui.updateNick(res.nick);
      console.log('connectionRes');
    });
  };

  ChatUI.prototype.nickChangeListener = function (ui) {
    this.chat.socket.on('nicknameChangeResult', function (res) {
      if (res.success) {
        ui.updateNick(res.nick);
      } else {
        console.log(res.nick + ' invalid');
      }
    });
  }

  ChatUI.prototype.registerListeners = function () {
    this.connectionListener(this);
    this.messageListener(this);
    this.submitHandler(this);
    this.nickChangeListener(this)
  };

  ChatUI.prototype.submitHandler = function (ui) {
    this.$chatForm.on("submit", function (e) {
      e.preventDefault();
      ui.processInput();
    });
  };

  ChatUI.prototype.messageListener = function (ui) {
    this.chat.socket.on('message', function (msg) {
      ui.updateChatWindow(msg);
    });
  };

  ChatUI.prototype.updateChatWindow = function (msg) {
    this.$chatText.append(
      "<strong style='color: salmon;'>" + msg.user + "</strong>: " + msg.text + "<br>"
    );
    this.$chatWindow.animate({ scrollTop: $('#chat-window')[0].scrollHeight}, 1000);
  };

  ChatUI.prototype.updateNick = function (name) {
    this.user = name;
    this.$textField.attr(
      "placeholder", "Nagging as '" + this.user + "'. Commands: /nick <name>");
  };

  ChatUI.prototype.processInput = function () {
    var messageTxt = this.$textField.val();
    if (messageTxt == "") return;

    if (this.isCommand(messageTxt)) {
      this.processCommand(messageTxt);
    } else {
      this.chat.sendMessage({ user: this.user, text: messageTxt } );
    }

    this.$textField.val('');
  };

  ChatUI.prototype.processCommand = function (cmd) {
    var full_command = cmd.split('/')[1].split(' ');
    var command = full_command[0];
    var arg = full_command[1];
    if (this.isValidCommand(command)) {
      this.commands[command](arg);
    } else {
      console.log('invalid command');
    }
  };

  ChatUI.prototype.isCommand = function (str) {
    return str[0] === "/";
  };

  ChatUI.prototype.isValidCommand = function (cmd) {
    return this.commands.hasOwnProperty(cmd);
  };



})(this);
