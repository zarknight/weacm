var chat = require('./chat');

exports.init = function(io) {

  var channels = [
    { id: 'r1', name: 'Channel 1' }, 
    { id: 'r2', name: 'Channel 2' },
    { id: 'r3', name: 'Channel 3' }
  ];

  var chatroom = new chat.ChatBox(io, channels, 'r1');
  chatroom.start();

};
