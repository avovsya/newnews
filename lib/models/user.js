var mongoose = require('mongoose'),
    userSchema;

userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    google           : {
        id           : String,
        accessToken  : String,
        refreshToken : String,
        email        : String,
        name         : String
    }

});

exports.User = mongoose.model('User', userSchema);
