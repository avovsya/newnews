var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    MailParser = require('mailparser').MailParser;

function ImapMessage (stream) {
    var _this = this,
        parser = new MailParser();

    stream.on("data", function(chunk){
        parser.write(chunk);
    });

    stream.on("end", function(){
        parser.end();
    });

    parser.on('end', function(mail) {
        _this.from = mail.from;
        _this.subject = mail.subject;
        _this.text = mail.text;
        _this.html = mail.html;
        _this.emit('loaded', mail);
    });
}

util.inherits(ImapMessage, EventEmitter);

module.exports = ImapMessage;
