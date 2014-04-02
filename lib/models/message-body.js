var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    messageBodySchema;

messageBodySchema = mongoose.Schema({
    userId: ObjectId,
    UID: Number,
    body: String
});

exports.MessageBody = mongoose.model('MessageBody', messageBodySchema);
