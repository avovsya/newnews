var MailParser = require('mailparser').MailParser,
    mimelib = require('mimelib');

var Message = function (msg, seqno) {
    var _this = this;

    _this.seqno = seqno;
    _this.headers = {};

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
            _this.from = mail.from;
            _this.subject = mail.subject;
            _this.text = mail.text;
            _this.html = mail.html;
        });
    });

    msg.on('attributes', function (attrs) {
        _this.attributes = attrs;
        _this.seen = !!~attrs.flags.join('').toLowerCase().indexOf('\\seen')
        _this.date = attrs.date;
    });
}

module.exports = Message;
