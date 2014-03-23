var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = require('../models/user').User,
    authConfig = require('../../authConfig.json');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID        : authConfig.google.clientID,
        clientSecret    : authConfig.google.clientSecret,
        callbackURL     : authConfig.google.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err) return done(err);

                if (user) {
                    // if a user is found, log them in
                    user.google.accessToken = accessToken;
                    user.save(function(err) {
                        if (err) throw err;
                        return done(null, user);
                    });
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.accessToken = accessToken;
                    newUser.google.refreshToken = refreshToken;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
};
