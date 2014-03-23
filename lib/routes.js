var GMailInterface = require('./gmail'),
    client         = new GMailInterface(),
    _              = require('underscore'),
    authConfig     = require('../authConfig.json');

module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        if (req.isAuthenticated()) {
            return res.send(JSON.stringify(req.user));
        } else {
            return res.redirect('/login');
        }
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/'] }));
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect: '/',
                failureRedirect: '/login'
            }));

    app.get('/login', function(req, res) {
        res.render('login');
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
    

    // SHOW LIST OF EMAILS
    app.get('/list', isLoggedIn, function (req, res) {
        var client = new GMailInterface();
        client.connect(authConfig, req.user, function () {
            client.getList({
                success: function (messages) {
                    res.render('list', {
                        messages: _.filter(messages, function (msg) {
                            return msg.from && msg.from.length > 0
                        })
                    });
                    //client.logout();
                },
                error: function (err) {
                    res.send(JSON.stringify(err));
                }
            });
        });
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
