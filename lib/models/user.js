var mongoose = require('mongoose'),
    userSchema;

userSchema = mongoose.Schema({

    initialized : { type: Boolean, default: false },

    lastDownloadedUID : Number,
    // TODO: remove default mailbox name
    mailbox: { type: String, default: 'Newsletters' },

    google           : {
        id           : String,
        accessToken  : String,
        refreshToken : String,
        email        : String,
        name         : String
    }

});

exports.User = mongoose.model('User', userSchema);
