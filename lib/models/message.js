var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
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
    date: Date,
    body: {
        html: String,
        text: String,
    }
});

exports.Message = mongoose.model('Message', messageSchema);
