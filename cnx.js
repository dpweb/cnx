var http = require('request'), cp = require('child_process'), mysql = require('mysql'),
url = require('url'), mongoskin = require('mongoskin'), redis = require('redis');

var cnx = {
    query: function(c, q, cb){
        if(!cb) cb = console.log;
        this[c.split(':')[0]](c, q, cb);
    },
    http: function(u, p, cb){
        !p ? http(u, cb) : http.post(u, p, function(e, r){cb(r.body)});
    },
    cmd: function(u, p, cb){
        cp.exec(u.replace('cmd://',''), cb);
    },
    mysql: function(u, p, cb){
        var cl = mysql.createConnection(u);
        !p ? cb(cl) : cl.query(p, cb);
    },
    sqlserver: function(u, p, cb){
        var ss = url.parse(u), userpass = ss.auth.split(':');
        var s = ['sqlcmd -U ', userpass[0], '@', host, ' -S ', host, ' -P ', c.pass, ' -d ', ss.path.replace('/',''),
                    ' -Q \"SET NOCOUNT ON;', p, '\" -h-1'].join('');
        cp.exec(s, cb);
    },
    mongo: function(u, cb){
        if(!cb || typeof(cb) === 'function') throw new Error('mongo requires only conn info and callback, returns a conn obj');
        var conn = mongoskin.db(u, { safe: false });
        cb(conn);
    },
    redis: function(u, p, cb){
        var ss = url.parse(u), userpass = ss.auth.split(':'), port = ss.path.match(/\:([^\/]*)/)[1];
        var cl = redis.createClient(port, host);
        cl.auth(userpass[0]);
        cl.on('ready', function(e){
            !p ? cb(cl) : cl.get(p, cb);
        })
    }
}

//cnx.query('http://google.com');
//cnx.query('http://dpsw.info/echo/', {hello:'world'});
//cnx.query('cmd://ls', function(e,r){ console.log('cmd', r.length > 10) });

//cnx.query('mysql://user:pass@host/cdrnet_test', 'select 1;');
//cnx.query('sqlserver://user:password@host/database', 'select 1;');
//cnx.query('mongo://user:password@host/database', function(db){
//    db.collection('test').find().toArray(console.log);
//});
//cnx.query('redis://user:password@host/database', function(c){});
