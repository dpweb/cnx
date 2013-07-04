var http = require('request'), cp = require('child_process'), mysql = require('mysql'),
mongoskin = require('mongoskin'), redis = require('redis');

var cnx = {
    query: function(c, q, cb){
        if(!cb) cb = console.log;
        this[c.split(':')[0]](c, q, cb);
    },
    http: function(u, q, cb){
        http(u, cb);
    },
    httpp: function(u, q, cb){
        http.post(u.replace('httpp','http'), q, cb);
    },
    cmd: function(u, p){
        cp.exec(u.replace('cmd://',''), p);
    },
    mysql: function(u, p, cb){
        var cl = mysql.createConnection(u);
        !p ? cb(cl) : cl.query(p, cb);
    },
    sqlserver: function(u, p, cb){
        var ss = u.match(/(.*)\:\/\/([^\:]*)\:([^@]*)@([^\/]*)\/(.*)/);
        var s = ['sqlcmd -U ', ss[2], ' -S ', ss[4], ' -P ', ss[3], ' -d ', ss[5],
                    ' -Q \"SET NOCOUNT ON;', p, '\" -h-1'].join('');
        cp.exec(s, cb);
    },
    mongo: function(u, cb){
        if(!cb || typeof(cb) !== 'function') throw new Error('mongo requires only conn info and callback, returns a conn obj');
        var conn = mongoskin.db(u, { safe: false });
        cb(conn);
    },
    redis: function(u, p, cb){
        var info = u.match(/redis\:\/\/(.*)\:(.*)@(.*)\:(.*)\//);
        var cl = redis.createClient(info[4], info[3]);
        cl.auth(info[2]);  p(null, cl);
    }
}

module.exports = cnx;
