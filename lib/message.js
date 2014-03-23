var MailParser = require('mailparser').MailParser,
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var MailBox = function (total) {
    this.total = total;
    this.totalLoaded = 0;
    this.messages = [];
};

util.inherits(MailBox, EventEmitter);

MailBox.prototype.add = function (msg) {
    var _this = this;

    this.messages.push(msg);

    if (msg.loaded) {
        this.totalLoaded += 1;
    } else {
        msg.on('loaded', function () {
            _this.totalLoaded += 1;
            if (_this.totalLoaded === _this.total) _this.emit('loaded');
        });
    }
}

var Message = function (msg, seqno) {
    var _this = this;

    _this.uid = msg.uid;
    _this.seqno = seqno;
    _this.headers = {};
    _this.loaded = false;

    msg.on('body', function (body) {
        var parser = new MailParser();

        body.on('data', function (data) {
            parser.write(data);
        });

        body.on('end', function () {
            parser.end();
        });

        parser.on('headers', function (hdrs) {
            _this.headers = hdrs;
        });

        parser.on('end', function(mail) {
            _this.emit('loaded');
            _this.from = mail.from;
            _this.subject = mail.subject;
            _this.text = mail.text;
            _this.html = mail.html;
            _this.loaded = true;
        });
    });

    msg.on('attributes', function (attrs) {
        _this.attributes = attrs;
        _this.seen = !!~attrs.flags.join('').toLowerCase().indexOf('\\seen')
        _this.date = attrs.date;
    });
}

util.inherits(Message, EventEmitter);

exports.Message = Message;
exports.MailBox = MailBox;
