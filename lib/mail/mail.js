var ImapClient = require('../imap/imapClient.js'),
    ImapMessage = require('../imap/imapMessage').ImapMessage,
    async = require('async'),
    Message = require('../models/message').Message,
    MessageBody = require('../models/message-body').MessageBody,
    _ = require('underscore'),
    redis = require('redis');

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

module.exports = {
    /**
     * Get email headers and body by UID
     * @param {Object} user
     * @param {Number} Email UID
     * @param {Function} Callback
     */
    getMessage: function(user, UID, callback) {
        var imapClient = new ImapClient(user),
            redisClient = redis.createClient();

        // 1. Find Mail uid in redis
        // 2. If exist - get mail body from Mongo
        // 2. Else - Download message from IMAP and save to Mongo
        //    Put message UID to redis
        //
        redisClient.sismember('message-bodies:' + user.id, UID, function (err, messageInDb) {
            if (err) return callback(err);
            if (messageInDb) {
                MessageBody.findOne({ userId: user.id, UID: UID }, function (err, messageBody) {
                    redisClient.quit();

                    if (err) return callback(err);

                    callback(null, messageBody.body);
                });
            } else {
                imapClient
                    .connect()
                    .getMessage(user.mailbox, UID, function (err, body) {
                        if (err) return callback(err);

                        body = body.html ? body.html : body.text;

                        var messageBody = new MessageBody();
                        messageBody.userId = user.id;
                        messageBody.UID = UID;
                        messageBody.body = body;
                        messageBody.save(function (err) {
                            // TODO: handel error
                            if (err) return redisClient.quit();

                            redisClient.sadd('message-bodies:' + user.id, UID, function () {
                                redisClient.quit();
                            });
                        });

                        callback(null, body);
                    });
            }
        });
    },

    getSenders: function (user, callback) {
        Message.aggregatedBySender(user._id, callback);
    },

    getMailsBySender: function (user, addr, name, callback) {
        Message.find({ "from.name": name, "from.address": addr }, callback);
    },

    /**
     * Get only new message headers from Mailbox
     * @param {Object} User
     * @param {Function} Callback
     */
    receiveNewMessages: function(user, callback) {
        var imapClient = new ImapClient(user);

        imapClient
            .connect()
            .listMessagesByUID(user.mailbox, user.lastDownloadedUID,
                    function (err, messages) {
                        if (err) return callback(err);
                        // remove first message because it is already in the database
                        messages.shift();
                        callback(null, convertMessagesToModels(messages));
                    });
    },

    /**
     * Get all message headers from Mailbox
     * @param {Object} User
     * @param {Function} Callback
     */
    receiveAllMessages: function(user, callback) {
        var imapClient = new ImapClient(user);

        // Get all messages from mailbox and save them to DB.
        // Initialize user
        imapClient
            .connect()
            .listMessages(user.mailbox, function (err, messages) {
                if (err) return callback(err);
                callback(null, convertMessagesToModels(messages));
            });
    },

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
            this.receiveNewMessages(user, function (err, messages) {
                Message.find({ UID: { $lte: user.lastDownloadedUID } }, function (err, docs) {
                    var allMessages = messages.concat(docs);
                    callback(null, allMessages);
                });
                if (messages.length <= 0) return;
                Message.batchSave(user._id, messages, function (err) {
                    if (err) return savedCallback(err);
                    user.emailsUpdated(getMaxMessagesUID(messages), savedCallback);
                });
            });
        } else {
            this.receiveAllMessages(user, function (err, messages) {
                process.nextTick(function () {
                    Message.batchSave(user._id, messages, function (err) {
                        if (err) return savedCallback(err);
                        user.emailsUpdated(getMaxMessagesUID(messages), savedCallback);
                    });
                });
                callback(null, messages);
            });
        }
    }
}
