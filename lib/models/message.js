var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    messageSchema;

messageSchema = mongoose.Schema({
    userId: ObjectId,
    uid: Number,
    seen: Boolean,
    fromName: String,
    fromAddress: String,
    subject: String,
    date: Date,
    body: {
        html: String,
        text: String,
    }
});

exports.Message = mongoose.model('Message', messageSchema);
