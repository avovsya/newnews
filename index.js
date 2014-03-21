var GMailInterface = require('./lib/gmail2'),
    fs             = require('fs'),
    //mailConfig     = JSON.parse(fs.readFileSync(process.cwd() + '/config.json', 'utf-8')),
    mailConfig = require('./config.json'),
    client         = new GMailInterface(),
    path           = require('path'),
    express        = require('express'),
    http           = require('http'),
    app            = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    client.connect(mailConfig);

    client.on('messages', function (msg) {
        res.send(msg[0].body);
    });

    client.on('error', function (err) {
        console.log('ERROR: ');
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

