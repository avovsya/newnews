var ImapClient = require('../imap/imapClient.js'),
    ImapMessage = require('../imap/imapMessage').ImapMessage,
    async = require('async'),
    Message = require('../models/message').Message,
    _ = require('underscore');

/**
 * Convert Imap messages to Message models
 * @param {Array} Imap messages
 * @return {Array} Message models
 */
function convertMessagesToModels(messages) {
    return _.map(messages,
            function (msg) {
                return msg.toModel();
            });
}

/**
 * Get max UID from messages
 * @param {Array} Messages
 * @returns {Number} UID
 */
function getMaxMessagesUID(messages) {
    return _.max(messages, function (msg) { return msg.UID; }).UID;
}

/**
 * Save messages to DB
 * @param {Object} User
 * @param {Object} Imap messages to save
 * @param {Function} Callback
 */
function saveMessagesToDb (user, messages, callback) {
    async.each(
            convertMessagesToModels(messages),
            function (message, iteratorCallback) {
                message.userId = user._id;
                message.save(iteratorCallback);
            },
            callback);
}

/**
 * Update user after downloading new messages
 * @param {Object} user
 * @param {Number} maxUID Maximal message uid in DB
 * @param {Function} callback
 */
function updateUser(user, maxUID, callback) {
    user.initialized = true;
    user.lastDownloadedUID = maxUID;
    user.save(callback);
}

module.exports = {
    /**
     * Get email messages for specified user, and save those messages to
     * database.
     * For user that have {initialized} flag set to true will be uploaded only new messages,
     * otherwise all messages from specified mailbox will be uploaded by IMAP.
     * The rest of the messages will be queried from database
     *
     * @param {Object} User - Current authenticated user
     * @param {Function} Callback to call when all messages has been uploaded
     * @param {Function} Callback to call when all messaged has been saved to Database
     */
    getMessagesForUser: function (user, callback, savedCallback) {
        var imapClient = new ImapClient(user);

        // Get only new messages for "initialized" user
        // The rest of messages get from DB
        if (user.initialized) {
            imapClient
                .connect()
                .listMessagesByUID(user.mailbox, user.lastDownloadedUID,
                        function (err, messages) {
                            if (err) return callback(err);
                            // remove first message because it is already in the database
                            messages.shift();
                            Message.find({ UID: { $lte: user.lastDownloadedUID } }, function (err, docs) {
                                var allMessages = convertMessagesToModels(messages).concat(docs);
                                callback(null, allMessages);
                            });
                            if (messages.length <= 0) return;
                            saveMessagesToDb(user, messages, function (err) {
                                if (err) return savedCallback(err);
                                updateUser(user, getMaxMessagesUID(messages), savedCallback);
                            });
                        });
        } else {
            // Get all messages from mailbox and save them to DB.
            // Initialize user
            imapClient
                .connect()
                .listMessages(user.mailbox, function (err, messages) {
                    if (err) return callback(err);
                    process.nextTick(function () {
                        callback(null, convertMessagesToModels(messages));
                    });
                    saveMessagesToDb(user, messages, function (err) {
                        if (err) return savedCallback(err);
                        updateUser(user, getMaxMessagesUID(messages), savedCallback);
                    });
                });

        }
    }
}
