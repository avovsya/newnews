var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    async = require('async'),
    messageSchema;

messageSchema = mongoose.Schema({
    userId: ObjectId,
    UID: Number,
    seen: Boolean,
    from: {
        name: String,
        address: String
    },
    title: String,
    date: Date
});

/**
 * Batch save messages to DB
 * @param {Object} User
 * @param {Object} Imap messages to save
 * @param {Function} Callback
 */
messageSchema.statics.batchSave = function (userId, messages, callback) {
    async.each(
            messages,
            function (message, iteratorCallback) {
                message.userId = userId;
                message.save(iteratorCallback);
            },
            callback);
};

messageSchema.statics.aggregatedBySender = function (userId, callback) {
    this
        .aggregate(
                {
                    $match: { userId: userId }
                },
                {
                    $group: {
                        _id: { address : "$from.address", name: "$from.name" },
                        total: { $sum: 1 },
                        unread: {
                            $sum: {
                                $cond: [ { $eq: [ "$seen", false ] }, 1, 0 ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id.name",
                        address: "$_id.address",
                        total: "$total",
                        unread: "$unread"
                    }
                },
                {
                    $sort: { name: 1 }
                })
        .exec(callback);
};

exports.Message = mongoose.model('Message', messageSchema);
