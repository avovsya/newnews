var ImapClient = require('../imap/client'),
    ImapMessage = require('../imap/imapMessage').ImapMessage,
    async = require('async'),
    Message = require('../models/message').Message,
    _ = require('underscore');

function saveMessagesToDb (user, messages, savedCallback) {
    async.each(messages, function (message, iteratorCallback) {
        message.userId = user._id;
        message.save(iteratorCallback);
    }, savedCallback);
}

module.exports = {
    /**
     * Get email messages for specified user, and save those messages to
     * database.
     * For user that have {initialized} flag set to true will be uploaded only new messages,
     * otherwise all messages from specified mailbox will be uploaded by IMAP.
     * The rest of the messages will be queried from database
     *
     * @param {user} Current authenticated user
     * @param {cb} Callback to call when all messages been uploaded 
     * @param {savedCallback} Callback to call when all messaged has been saved
     * to Database
     */
    getMessagesForUser: function (user, cb, savedCallback) {
        var imapClient = new ImapClient(user);

        if (user.initialized) {
            //get only new messages
            //the rest get from database
            //1. Get max uid of currently uploaded messages
            //2. Fetch all messages with higher id
            
            imapClient.connect();
            // TODO: mailbox name should be in user preferences
            imapClient.listMessagesByUID(user.mailbox || 'Newsletters', user.lastDownloadedUID ,function (err, messages) {
                if (err) return cb(err);
                // remove first message because it is already in the database
                messages.shift();
                Message.find({ uid: { $lte: user.lastDownloadedUID } }, function (err, docs) {
                    var oldMessages = _.map(docs, ImapMessage.fromModel),
                        allMessages = messages.concat(oldMessages);
                    cb(null, allMessages);
                });
                if (messages.length <= 0) return;
                saveMessagesToDb(user, _.map(messages, ImapMessage.toModel), function (err) {
                    if (err) return savedCallback(err);
                    user.lastDownloadedUID = _.max(messages, function (msg) { return msg.uid; }).uid;
                    user.save(savedCallback);
                });
            });
        } else {
            //get all messages from mailbox and save them to DB

            imapClient.connect();
            // TODO: mailbox name should be in user preferences
            imapClient.listMessages(user.mailbox || 'Newsletters', function (err, messages) {
                if (err) return cb(err);
                process.nextTick(function () {
                    cb(null, messages);
                });
                saveMessagesToDb(user, _.map(messages, ImapMessage.toModel), function (err) {
                    if (err) return savedCallback(err);
                    user.initialized = true;
                    user.lastDownloadedUID = _.max(messages, function (msg) { return msg.uid; }).uid;
                    user.save(savedCallback);
                });
            });

        }
    }
}
