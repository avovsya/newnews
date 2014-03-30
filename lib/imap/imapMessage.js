var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    MailParser = require('mailparser').MailParser,
    Message = require('../models/message.js').Message;

function ImapMessageBody (stream) {
    var _this = this,
        parser = new MailParser();

    stream.pipe(parser);

    //stream.on('data', function(chunk){
        //parser.write(chunk);
    //});

    //stream.on('end', function(){
        //parser.end();
    //});

    parser.on('end', function(mail) {
        _this.text = mail.text;
        _this.html = mail.html;
        _this.emit('loaded', _this);
    });
}

util.inherits(ImapMessageBody, EventEmitter);

function ImapMessage (msg) {
    this.UID = msg.UID;
    this.seen = typeof msg.seen === 'undefined' ?
        !!~msg.flags.join('').toLowerCase().indexOf('\\seen') :
        msg.seen;
    this.from = msg.from;
    this.title = msg.title;
    this.date = msg.date;
}

ImapMessage.prototype.toModel = function () {
    var model = new Message();

    model.UID = this.UID;
    model.seen = this.seen;
    model.from = this.from;
    model.title = this.title;
    model.date = this.date;

    return model;
}

exports.ImapMessageBody = ImapMessageBody;
exports.ImapMessage = ImapMessage;
