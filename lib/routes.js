var _              = require('underscore'),
    mail = require('./mail/mail');

module.exports = function (app, passport) {

    app.get('/', isLoggedIn, function (req, res) {
        res.render('index');
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
        mail.getMessagesForUser(req.user, function (err, messages) {
            // TODO: error handler
            if (err) console.log(err);
            res.render('list', { messages: messages });
        }, function () { console.log('all saved') });
    });

    // =====================================
    // API ROUTES ================
    // =====================================
    app.get('/mail/:uid', isLoggedIn, function (req, res) {
        mail.getMessage(req.user, req.params.uid, function (err, message) {
            if (err) return res.send(err);
            res.send(message);
        });
    });

    app.get('/api/mail/:uid', isLoggedIn, function (req, res) {
        mail.getMessage(req.user, req.params.uid, function (err, body) {
            res.json({
                success: !err,
                err: err,
                body: body
            });
        });
    });

    app.get('/api/senders', isLoggedIn, function (req, res) {
        mail.getSenders(req.user, function (err, senders) {
            res.json({
                success: !err,
                err: err,
                senders: senders
            });
        });
    });

    app.get('/api/senders/:addr/:name/mail', isLoggedIn, function (req, res) {
        mail.getMailsBySender(req.user,
            req.params.addr,
            req.params.name,
            function (err, messages) {
                res.json({
                    success: !err,
                    err: err,
                    messages: messages
                });
            });
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
