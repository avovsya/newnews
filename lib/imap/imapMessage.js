var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    MailParser = require('mailparser').MailParser,
    MessageModel = require('../models/message.js').Message;

function ImapMessageBody (stream) {
    var _this = this,
        parser = new MailParser();

    stream.on('data', function(chunk){
        parser.write(chunk);
    });

    stream.on('end', function(){
        parser.end();
    });

    parser.on('end', function(mail) {
        //_this.from = mail.from;
        //_this.subject = mail.subject;
        //_this.date = mail.date;
        _this.text = mail.text;
        _this.html = mail.html;
        _this.emit('loaded', mail);
    });
}

util.inherits(ImapMessageBody, EventEmitter);

function ImapMessage (msg) {
    this.uid = msg.UID;
    this.seen = typeof msg.seen === 'undefined' ?
        !!~msg.flags.join('').toLowerCase().indexOf('\\seen') :
        msg.seen;
    this.from = msg.from;
    this.subject = msg.title;
    this.date = msg.date;
}

ImapMessage.fromModel = function (model) {
    var msg = { from: {} };

    msg.UID = model.uid;
    msg.seen = model.seen;
    msg.from.name = model.fromName;
    msg.from.address = model.fromAddress;
    msg.title = model.subject;
    msg.date = model.date;

    return new ImapMessage(msg);
}

ImapMessage.toModel = function (message) {
    var model = new MessageModel();

    model.uid = message.uid;
    model.seen = message.seen;
    model.fromName = message.from.name;
    model.fromAddress = message.from.address;
    model.subject = message.subject;
    model.date = message.date;

    return model;
}

exports.ImapMessageBody = ImapMessageBody;
exports.ImapMessage = ImapMessage;
