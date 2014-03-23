var inbox = require('inbox'),
    authConfig = require('../../authConfig'),
    ImapMessage = require('./imapMessage');

function ImapClient (user) {
    xoauth2 = "user=" + user.google.email + "\001auth=Bearer " + user.google.accessToken + "\001\001";
    this.user = user;
    this.client = inbox.createConnection(authConfig.imap.port, authConfig.imap.host, {
        secureConnection: true,
        auth: {
            //XOAuth2Token: xoauth2
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

ImapClient.prototype.connect = function () { this.client.connect() };

ImapClient.prototype.listMessages = function (mailbox, cb) {
    var _this = this
    this.client.on('connect', function (err, info) {
        if (err) return cb(err)
        _this.client.openMailbox(mailbox, function (err, boxInfo) {
            if (err) return cb(err)
            _this.client.listMessages(0, cb);
            _this.client.close();
        });
    });
};

ImapClient.prototype.getMessage = function (mailbox, uid, cb) {
    var _this = this
    this.client.on('connect', function (err, info) {
        _this.client.openMailbox(mailbox, function (err, boxInfo) {
            if (err) return cb(err)
            var msgStream = _this.client.createMessageStream(uid),
                message = new ImapMessage(msgStream);

            message.on('loaded', cb);
        });
    });

}

module.exports = ImapClient;
