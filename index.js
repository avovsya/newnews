var path           = require('path'),
    express        = require('express'),
    port           = process.env.PORT || 3000,
    app            = express(),
    passport    = require('passport'),
    mongoose = require('mongoose'),
    config = require('./config');

mongoose.connect(config.db.url);
require('./lib/config/passport')(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('short'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.cookieParser('scooby do'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'scooby do' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

require('./lib/routes')(app, passport);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.listen(port);
console.log('Listening port: ', port);
