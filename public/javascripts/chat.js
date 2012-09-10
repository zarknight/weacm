(function($) {

  this.ChatBox = new Class({

    Implements: [ Options, Events ],

    options: {

    },

    initialize: function(id, options) {
      this.setOptions(options);
      this.socket = io.connect();
      this.container = $(id);
      this.createUI();
      this.initChannelSelector();
      this.initMessageSender();
      this.initMessageReceiver();
      this.login();
    },

    createUI: function() {
      var cpanel = this.cpanel = new Element('div#x-chat-panel');
      var cselector = this.cselector = new Element('ul#x-chat-channels');
      var cconversation = this.cconversation = new Element('div#x-chat-content');
      var csender = this.csender = new Element('div#x-chat-sender');
      var cinput = this.cinput = new Element('input#x-chat-input', { type: 'text' });
      var cbutton = this.cbutton = new Element('button#x-chat-button', { text: 'SEND' });

      cselector.inject(cpanel);
      cconversation.inject(cpanel);
      cinput.inject(csender);
      cbutton.inject(csender);
      csender.inject(cpanel);
      cpanel.inject(this.container);

      cbutton.setStyle('display','none');
    },

    initChannelSelector: function() {
      var self = this;

      this.socket.on('update_channels', function(channels, cid) {
        var clist = self.cselector.empty();
        
        channels.each(function(channel) {
          var item = new Element('li');
          
          if (channel.id == cid) {
            item.set('text', channel.name);
          } else {
            new Element('a', { 
              href: 'javascript:void(0)', 
              text: channel.name 
            }).addEvent('click', function() {
              self.socket.emit('switch_channel', channel.id);
            }).inject(item);
          }
          
          item.inject(clist);;
        });
        
        new Element('div.clearfix').inject(clist);
      });
    },

    initMessageSender: function() {
      var self = this;

      this.addEvent('checkandsend', function(ipt) {
        var msg = ipt.get('value');
        if (msg) {
          self.socket.emit('send_chat', msg);
          ipt.set('value', '').focus();
        }
      });

      this.cinput.addEvent('keypress', function(event) {
        if (event.code == 13) {
          self.fireEvent('checkandsend', self.cinput);
        }
      });

      this.cbutton.addEvent('click', function(event) {
        self.fireEvent('checkandsend', self.cinput);
      });
    },

    initMessageReceiver: function() {
      this.socket.on('update_chat', function(username, data, type) {
        var msgctn = new Element('div.' + type);

        if (username != 'SERVER') {
          var namelnk = new Element('a.x-msg-user', { text: username });
      
          if (username != this.currentUser) {
            namelnk.set('href', 'javascript:void(0)');
            namelnk.addEvent('click', function() {
              this.cinput.set('value', '[@' + username + ']');
            });
          }
          
          namelnk.inject(msgctn);
          new Element('span.x-msg-sep', { text: ':' }).inject(msgctn);
        }
        
        new Element('span.x-msg-body', { html: data }).inject(msgctn);

        msgctn.inject(this.cconversation);
      }.bind(this));
    },

    login: function() {
      this.socket.on('connect', function() {
        var username = this.currentUser = "U-" + (+new Date);
        this.socket.emit('add_user', username);
      }.bind(this));
    }

  });

})(document.id);

window.addEvent('domready', function() {
  var chatbox = new ChatBox('chat-container', {});
});
