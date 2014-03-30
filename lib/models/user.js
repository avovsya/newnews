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

/**
 * Update user after downloading new messages
 * @param {Number} maxUID Maximal message uid in DB
 * @param {Function} callback
 */
userSchema.methods.emailsUpdated = function(maxUID, callback) {
    this.initialized = true;
    this.lastDownloadedUID = maxUID;
    this.save(callback);
}

exports.User = mongoose.model('User', userSchema);
