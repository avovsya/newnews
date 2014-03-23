var _              = require('underscore'),
    ImapClient     = require('./imap/client');

module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        if (req.isAuthenticated()) {
            //return res.send(JSON.stringify(req.user));
            return res.redirect('/list');
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


    // =====================================
    // EMAIL RELATED ROUTES ================
    // =====================================
    app.get('/list', isLoggedIn, function (req, res) {
        var imapClient = new ImapClient(req.user);
        imapClient.connect();
        imapClient.listMessages('Newsletters', function (err, messages) {
            if (err) console.log('Imap: ', err);
            res.send(JSON.stringify(messages));
        });
    });

    app.get('/email/:uid', isLoggedIn, function (req, res) {
        var imapClient = new ImapClient(req.user);

        imapClient.connect();
        imapClient.getMessage('Newsletters', req.params.uid, function (message) {
            if (message.html && message.html.lenght > 0){
                return res.send(message.html);
            } else {
                return res.send(message.html);
            }
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
