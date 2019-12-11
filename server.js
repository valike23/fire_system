'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
const mysql = require('mysql');
var app = express();
var connection = mysql.createConnection({
    host: 'db4free.net',
    user: 'fire_service',
    password: 'fire_service',
    database: 'fire_service'
});


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token");
    if (req.method === "OPTIONS")
        res.send(200);
    next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});
app.get('/api/getActiveInc', function (req, res) {
    let sql = 'SELECT * FROM `incidence` WHERE STATUS = 0';

    connection.query(sql, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
});

app.get('/api/getAllInc', function (req, res) {
    let sql = 'SELECT * FROM `incidence` ORDER BY `incidence`.`timeReport` DESC';
    connection.query(sql, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
})
app.get('/api/changeStatus/:status/:id', function (req, res) {
    let data = [req.params.status, req.params.id];
    let sql = 'UPDATE `incidence` SET `status`=? WHERE  id= ?';
    connection.query(sql,data, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
})
app.post('/api/submit', function (req, res) {
    let sql = 'INSERT INTO `incidence` set ?';
    connection.query(sql,req.body, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
})
app.post('/api/error', function (req, res) {
    let sql = 'INSERT INTO `error` set ?';
    connection.query(sql, req.body, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
})
app.get('/api/getMyInc/:phone', function (req, res) {
    let sql = 'SELECT * FROM `incidence` where phone =? ORDER BY `incidence`.`status` ASC';
    connection.query(sql, req.params.phone, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
});
app.get('/api/allNews', function (req, res) {
    let sql = 'SELECT * FROM news ORDER BY `news`.`createdDate` ASC';
    connection.query(sql, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
});
//notifications
app.post('/api/notifications', function (req, res) {
    let sql = 'INSERT INTO `notifications` set ?';
    connection.query(sql, req.body, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
})
app.get('/api/notifications', function (req, res) {
    let sql = 'SELECT * FROM `notifications` ORDER BY `notifications`.`createdTime` DESC';
    connection.query(sql, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
})
//news
app.post('/api/news', function (req, res) {
    let sql = 'INSERT INTO `news` set ?';
    connection.query(sql, req.body, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
});
app.get('/api/news', function (req, res) {
    let sql = 'SELECT * FROM `news` ORDER BY `news`.`createdDate` DESC';
    connection.query(sql, function (err, results) {
        if (err) {
            res.status(503);
            res.json({
                err: "A DB related error occured",
                trace: err
            })
        }
        res.json(results);
        res.end();
    })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
//app.use(function (err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});
app.set('port', process.env.PORT || 1998);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
