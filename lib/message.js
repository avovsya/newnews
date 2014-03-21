var MailParser = require('mailparser').MailParser,
    mimelib = require('mimelib');

var Message = function (msg, seqno) {
    var _this = this;

    _this.seqno = seqno;
    _this.headers = {};
    _this.uid = msg.uid;
    _this.flags = msg.flags;
    _this.date = msg.date;
    _this.body = '';

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
            _this.body = mimelib.decodeQuotedPrintable(mail.html)
            //_this.body = mail.text;
        });
    });

    msg.on('attributes', function (attrs) {
        _this.attributes = attrs;
    });
}

module.exports = Message;
