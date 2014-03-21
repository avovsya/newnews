var Imap = require('imap'),
    inspect = require('util').inspect,
    imap = new Imap({
        user: 'artem.nomad@gmail.com',
        password: 'solaris2424',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

function openInbox(callback) {
    imap.openBox('Newsletters', true, callback);
}

imap.once('ready', function () {
    openInbox(function (err, box) {
        if (err) throw err;
        var f = imap.seq.fetch('1:1', {
            bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)'],
            struct: true
        });

        f.on('message', function(msg, seqno) {
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                var buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function() {
                    var mail = Imap.parseHeader(buffer);
                    console.log('Subject: %s', mail.subject[0]);
                    console.log('From: %s', mail.from[0]);
                });
            });
            msg.once('attributes', function(attrs) {
                //console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function() {
                console.log(prefix + 'Finished');
            });
        });

        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
        });

        f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
        });
    });
});

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('Connection ended');
});

imap.connect();
