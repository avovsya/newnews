var _              = require('underscore'),
    mail = require('./mail/mail');

module.exports = function (app, passport) {

    app.get('/', isLoggedIn, function (req, res) {
        //res.render('index');
        res.send('client/app/index.html')
    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://mail.google.com/'] }));
    app.get('/api/auth/google/callback',
            passport.authenticate('google', {
                successRedirect: '/api/auth/complete',
                failureRedirect: '/api/auth/complete'
            }));

    app.get('/api/auth/complete', function (req, res) {
        if (req.user) {
            res.render('authState', { state: 'success', user: req.user.google.email })
        }
        else {
            res.render('authState', { state: 'failure' })
        }
    });

    app.get('/api/auth/ping', isLoggedIn, function (req, res) {
        res.json({ success: true, user: req.user.google.email });
    })

    app.del('/api/auth/session', function(req, res){
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.json({ success: true })
    });

    // =====================================
    // API ROUTES ================
    // =====================================
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
            res.json(senders)
            //res.json({
                //success: !err,
                //err: err,
                //senders: senders
            //});
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
    res.status(401).json({ success: false, error: 'Unauthorized'});
}
