var Imap = require('imap'),
    util = require('util'),
    mimelib = require('mimelib'),
    EventEmitter = require('events').EventEmitter,
    MailParser = require('mailparser').MailParser,
    Message = require('./message.js'),
    GMailInterface = function () {};

util.inherits(GMailInterface, EventEmitter);

module.exports = GMailInterface;


GMailInterface.prototype.openBox = function (boxName) {
    var _this = this,
        messages = [];

    _this.connection.openBox(boxName, true, function (err, box) {
        console.log('box opened: ', boxName);
        if (err) return _this.emitError();

        var fetch = _this.connection.seq.fetch('1:3', { struct: true, bodies: '' });

        fetch.on('message', function (msg, seqno) {
            messages.push(new Message(msg, seqno));
        });

        fetch.once('error', _this.emitError);

        fetch.once('end', function () {
            _this.emit('messages', messages);
        });
    });
}

GMailInterface.prototype.connect = function (options) {
    var _this = this;

    _this.connection = new Imap({
        user: options.username,
        password: options.password,
        host: options.imap.host,
        port: options.imap.port,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    _this.connection.once('ready', function () {
        _this.openBox('Newsletters');
    });

    _this.connection.once('error', _this.emitError);

    _this.connection.once('end', function() {
        _this.logout();
    });

    _this.connection.connect();

    return _this;
};

GMailInterface.prototype.emitError = function (err) {
    this.emit('error', err);
}

GMailInterface.prototype.logout = function (cb) {
    this.connection.logout(cb);
};
