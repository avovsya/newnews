var inbox = require('inbox'),
    authConfig = require('../../authConfig'),
    ImapMessageBody = require('./imapMessage').ImapMessageBody,
    ImapMessage = require('./imapMessage').ImapMessage,
    _ = require('underscore');

function ImapClient (user) {
    this.user = user;
    this.client = inbox.createConnection(authConfig.imap.port, authConfig.imap.host, {
        secureConnection: true,
        auth: {
            XOAuth2: {
                user: user.google.email,
                clientId: authConfig.google.clientID,
                clientSecret: authConfig.google.clientSecret,
                refreshToken: user.google.refreshToken,
                accessToken: user.google.accessToken,
                timeout: 3600
            }
        }
    });
};

ImapClient.prototype.connect = function () { this.client.connect(); return this; };

ImapClient.prototype.listMessagesByUID = function (mailbox, UID, cb) {
    var _this = this
    this.client.on('connect', function (err, info) {
        if (err) return cb(err)
        _this.client.openMailbox(mailbox, function (err, boxInfo) {
            if (err) return cb(err)
            _this.client.listMessagesByUID(UID, '*', function (err, messages) {
                if (err) return cb(err);
                var transformed = _.map(messages, function (msg) {
                    return new ImapMessage(msg);
                });
                _this.client.close();
                cb(null, transformed);
            });
        });
    });
};

ImapClient.prototype.listMessages = function (mailbox, cb) {
    var _this = this
    this.client.on('connect', function (err, info) {
        if (err) return cb(err)
        _this.client.openMailbox(mailbox, function (err, boxInfo) {
            if (err) return cb(err)
            _this.client.listMessages(0, function (err, messages) {
                if (err) return cb(err);
                var transformed = _.map(messages, function (msg) {
                    return new ImapMessage(msg);
                });
                _this.client.close();
                cb(null, transformed);
            });
        });
    });
};

ImapClient.prototype.getMessage = function (mailbox, UID, cb) {
    var _this = this
    this.client.on('connect', function (err, info) {
        _this.client.openMailbox(mailbox, function (err, boxInfo) {
            if (err) return cb(err)
            var msgStream = _this.client.createMessageStream(UID),
                body = new ImapMessageBody(msgStream);

            body.on('loaded', cb);
        });
    });

}

module.exports = ImapClient;
