var util = require('util'),
    events = require('events');

const U_SERVER = 'SERVER';

var ChatBox = function(io, chs, dft) {

  events.EventEmitter.call(this);

  var self = this;

  var users = {};
  var channelMap = {};
  var channelArr = [];
  var defaultChannelId;

  //-----------------------------------------------------------------
  var loadChannels = function(list, dft) {
    defaultChannelId = dft;
    channelArr = list;
    channelArr.forEach(function(i){
      channelMap[i.id] = i.name;
    });
  };

  loadChannels(chs, dft);

  //-----------------------------------------------------------------
  this.start = function() {
    io.sockets.on('connection', function(socket) {
      socket.on('add_user', function(username) {
        users[username] = socket.id;

        socket.username = username;
        socket.channel = defaultChannelId;

        socket.join(defaultChannelId);
        socket.emit('update_chat', U_SERVER, 'you have connected to ' + channelMap[defaultChannelId], 'x-a-msg');
        socket.broadcast.to(defaultChannelId).emit('update_chat', U_SERVER, username + ' has connected to this channel', 'x-a-msg');
        socket.emit('update_channels', channelArr, defaultChannelId);
      });

      socket.on('send_chat', function(data) {
        var username = socket.username;
        var m = data.match(/^\[@(.*?)\](.*?)$/);

        if (m) {
          var destuser = m[1], msg = m[2];
          var socketid = users[destuser];

          if (socketid) {
            var destsock = io.sockets.sockets[socketid];
            destsock.emit('update_chat', username, msg, 'x-p-msg');
            socket.emit('update_chat', username, msg, 'x-o-msg');
          } else {
            socket.emit('update_chat', U_SERVER, 'fail to send message to non-online user', 'x-a-msg');
          }
        } else {
          io.sockets.in(socket.channel).emit('update_chat', username, data, 'x-g-msg');
        }
      });

      socket.on('switch_channel', function(newChannelId) {
        socket.leave(socket.channel);
        socket.join(newChannelId);

        socket.emit('update_chat', U_SERVER, 'you have connected to ' + channelMap[newChannelId], 'x-a-msg');
        socket.broadcast.to(socket.channel).emit('update_chat', U_SERVER, socket.username + ' has left this channel', 'x-a-msg');
        socket.channel = newChannelId;
        socket.broadcast.to(newChannelId).emit('update_chat', U_SERVER, socket.username + ' has joined this channel', 'x-a-msg');
        socket.emit('update_channels', channelArr, newChannelId);
      });

      socket.on('disconnect', function() {
        delete users[socket.username];
        io.sockets.emit('update_users', users);
        socket.broadcast.emit('update_chat', U_SERVER, socket.username + ' has disconnected', 'x-a-msg');
        socket.leave(socket.channel);
      });
    });
  };
	
};

util.inherits(ChatBox, events.EventEmitter);

exports.ChatBox = ChatBox;
