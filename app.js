var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

var sendinfo = require('./routes/sendmail.js');
var index = require('./routes/index');
var question = require('./routes/question');
var test = require('./routes/test');
var collect = require('./routes/collect');
var fin = require('./routes/fin');

var admin_home = require('./routes/admin_home');
var questionlist = require('./routes/questionlist');
var answerlist = require('./routes/answerlist');
var dayreport = require('./routes/dayreport');

var app = module.exports = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({resave: false, saveUninitialized: false, secret: "sdsadasghjhbwezz"}));

app.use('/question', question);
// app.post('/test', test);
app.use('/test', test);
app.use('/collect', collect);
app.use('/fin', fin);
// app.get('/test/:qno',test);
app.get('/admin/:dept', admin_home);
app.post('/admin/:dept', admin_home);
app.get('/admin/questionlist/:dept', questionlist);
app.get('/admin/answerlist/:dept/:mobile', answerlist);
app.get('/adminDayReport/:dept', dayreport);

app.post('/index', index);

var urlencodedparser = bodyParser.urlencoded({extended: false});
app.get('/', function (req, res) {
    req.session.a=0;
    res.render('firstpage.ejs');
});
app.post('/adm', function (req, res, next) {
    res.render('admin.ejs');
});
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"bru"
});

var arr = [];
var arrlength;
app.post('/usr', function (req, res, next) {
    function show(callback) {
        con.query("SELECT * FROM dep;", function (err, results) {
            if (err) console.log("error encountered");
            for (var i = 0; i < results.length; i++)
                arr[i] = results[i].depname;
            arrlength = arr.length;
            callback();
        });

    }

    show(function () {
        res.render('userform.ejs', {
            arr: arr,
            arrlength: arrlength
        });
    });
});


var correctuser, correctpassword;
con.query("select username from admins", function (err, result, fields) {
    if (err) console.log("error encountered");
    correctuser = result;
});

con.query("select password from admins", function (err, result, fields) {
    if (err) console.log("error encountered");
    correctpassword = result;
});

var id, i;
con.query("select MAX(id) as max from admins", function (err, result, fields) {
    if (err) console.log("error encountered");
    id = result;
});
var count;
var depp = [];
app.post('/admin', urlencodedparser, function (req, res, next) {


    function first(callback) {
        con.query("select count(*) as count from dep", function (err, result2) {
            if (err) throw err;
            console.log(result2);

            console.log(JSON.stringify(result2));
            var x = JSON.stringify(result2);
            console.log(x);
            var y = JSON.parse(x);
            console.log(y);
            console.log(typeof y);

            count = result2[0].count;
        });
        con.query("select * from dep", function (err, result1) {
            if (err) throw err;
            console.log(result1);


            for (var i = 0; i < count; i++) {
                console.log(result1[i].depname);
                depp[i] = result1[i].depname;
                console.log(depp[i]);
            }
            console.log(JSON.stringify(result1));
            console.log(depp);

            callback();

        });

    }

    first(function () {
        for (i = 0; i < id[0].max; i++) {
            if (correctuser[i].username === req.body.u && correctpassword[i].password === req.body.p) {
                req.session.a=1;
                res.render('adminpage.ejs', {
                    count: count,
                    dep: depp
                });
                break;
            }
        }
        if (i === id[0].max) {
            res.render('admin.ejs');
        }
    });
});

app.get('/admin', function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
if(req.session.a===1) {
    var newrow = req.query.newname;
    console.log("***********");
    console.log(newrow);
    console.log("***********");
    if (newrow !== undefined) {
        console.log("###################");
        console.log(newrow);
        console.log("###################");
        con.query("CREATE TABLE " + newrow + " LIKE nursing", function (err) {
            if (err) console.log("error encountered");
        });
        con.query("CREATE TABLE " + newrow + "_question_list LIKE nursing_question_list", function (err) {
            if (err) console.log("error encountered");
        });
        con.query("ALTER TABLE dep AUTO_INCREMENT=1", function (err) {
            if (err) console.log("error encountered4");
        });

        var sql = "insert into dep(depname) values ('" + newrow + "');";
        con.query(sql, function (err) {
            if (err) console.log("error encountered");
        });
    }

    function first(callback) {
        con.query("select count(*) as count from dep", function (err, result2) {
            if (err) throw err;
            console.log(result2);

            console.log(JSON.stringify(result2));
            var x = JSON.stringify(result2);
            console.log(x);
            var y = JSON.parse(x);
            console.log(y);
            console.log(typeof y);

            count = result2[0].count;
        });
        con.query("select * from dep", function (err, result1) {
            if (err) throw err;
            console.log(result1);


            for (var i = 0; i < count; i++) {
                depp[i] = result1[i].depname;
                console.log(depp[i]);
            }
            console.log(JSON.stringify(result1));
            console.log(depp);

            callback();

        });

    }

    var newrow1 = req.query.newname1;
    console.log("***********");
    console.log(newrow1);
    console.log("***********");
    if (newrow1 !== undefined && newrow1 !== 'nursing') {
        console.log("###################");
        console.log(newrow1);
        console.log("###################");
        con.query("DROP TABLE " + newrow1 + " ;", function (err, result) {
            if (err) console.log("error encountered1");
            console.log(result);
        });
        con.query("DROP TABLE " + newrow1 + "_question_list ;", function (err, result) {
            if (err) console.log("error encountered2");
            console.log(result);

        });
        sql = "delete from dep where depname = '" + newrow1 + "';";
        con.query(sql, function (err) {
            if (err) console.log("error encountered3");
        });
        con.query("ALTER TABLE dep AUTO_INCREMENT=1", function (err) {
            if (err) console.log("error encountered4");
        });


    }

    first(function () {

        res.render('adminpage.ejs', {
            count: count,
            dep: depp
        });

    });
}
else{
    res.render('admin.ejs');
}

});
app.post('/admins', function (req, res, next) {
if(req.session.a===1) {
    var newrow = req.query.newname;
    console.log("***********");
    console.log(newrow);
    console.log("***********");
    if (newrow !== undefined) {
        console.log("###################");
        console.log(newrow);
        console.log("###################");
        con.query("CREATE TABLE " + newrow + " LIKE nursing", function (err) {
            if (err) console.log("error encountered");
        });
        var sql = "insert into dep(depname) values ('" + newrow + "');";
        con.query(sql, function (err) {
            if (err) console.log("error encountered");
        });
    }

    function first(callback) {
        con.query("select count(*) as count from dep", function (err, result2) {
            if (err) throw err;
            console.log(result2);

            console.log(JSON.stringify(result2));
            var x = JSON.stringify(result2);
            console.log(x);
            var y = JSON.parse(x);
            console.log(y);
            console.log(typeof y);

            count = result2[0].count;
        });
        con.query("select * from dep", function (err, result1) {
            if (err) throw err;
            console.log(result1);


            for (var i = 0; i < count; i++) {
                depp[i] = result1[i].depname;
                console.log(depp[i]);
            }
            console.log(JSON.stringify(result1));
            console.log(depp);

            callback();

        });

    }

    first(function () {

        res.render('adminpage.ejs', {
            count: count,
            dep: depp
        });

    });
}
else{
    res.render('admin.ejs');
}

});
app.post('/forpwd', function (req, res, next) {
    res.render('forgot.ejs');
});

app.post('/mail', urlencodedparser, function (req, res, next) {

    for (i = 0; i < id[0].max; i++)
        if (req.body.user === correctuser[i].username) {
            sendinfo.sendmail(i + 1);
            res.render('admin.ejs');
            break;
        }
    if (i === id[0].max) {
        res.render('admin.ejs');
    }
});

var pswd, userpassword, dep;

app.post('/userform', urlencodedparser, function (req, res, next) {

    pswd = req.body.field5;
    dep = req.body.field4;
    req.session.dep=dep;
    console.log(dep);
    con.query("select password from user", function (err, result, fields) {
        if (err) console.log("error encountered");
        userpassword = result[0].password;
        if (pswd === userpassword) {
            con.query("insert into " + dep + " (name,mobile,email) values ('" + req.body.field1 + "','" + req.body.field3 + "','" + req.body.field2 + "')", function (err, result, fields) {

                if (err) console.log("error encountered");
                req.session.number=req.body.field3;
            });
            var time, noques;
            con.query("select timelimit,questions from user", function (err, result, fields) {
                if (err) console.log("error encountered");
                time = result[0].timelimit;
                noques = result[0].questions;
                res.redirect('/question')
                // res.render('start.ejs', {num: noques, tlimit: time});
            });

        }
        else {
            res.render('userform.ejs');
        }
    });


});

app.post('/adlogin', function (req, res, next) {
    if(req.session.a===1){
        res.render('adminrights.ejs');
    }
    else {
        res.render('admin.ejs');
    }});

app.post('/add', urlencodedparser, function (req, res, next) {
    if(req.session.a===1){
        con.query("ALTER TABLE admins AUTO_INCREMENT=1",function (err) {
            if (err)  console.log("error encountered");
        });
        con.query("insert into admins (userName,password,email) values ('"+req.body.nu+"','"+req.body.np+"','"+req.body.ne+"')", function (err, result, fields) {
            if (err) console.log("error encountered");
            res.render('adminrights.ejs')

        });
    }
    else {
        res.render('admin.ejs');
    }

});

app.post('/delete', urlencodedparser, function (req, res, next) {
    if(req.session.a===1){
        var du=req.body.cu;
        con.query("DELETE FROM `admins` WHERE userName='"+du+"' ", function (err, result, fields) {
            if (err) console.log("error encountered");
            res.render('adminrights.ejs');

        });    }
    else {
        res.render('admin.ejs');
    }

});

app.post('/change', urlencodedparser, function (req, res, next) {
    if(req.session.a===1){
        var ccu=req.body.cur;
        var nnu=req.body.nur;
        var nnp=req.body.npw;
        var nne=req.body.nem;
        con.query("UPDATE admins SET userName='"+nnu+"',password='"+nnp+"',email='"+nne+"' WHERE userName='"+ccu+"' ", function (err, result, fields) {
            if (err) console.log("error encountered");
            res.render('adminrights.ejs');
        });    }
    else {
        res.render('admin.ejs');
    }
});

app.post('/quizdetail', function (req, res, next) {
    if(req.session.a===1){
        res.render('quizdetails.ejs');
    }
    else {
        res.render('admin.ejs');
    }});


app.post('/quizd', urlencodedparser, function (req, res, next) {

    if(req.session.a===1){
        var noques=req.body.noquestions;
        var tl=req.body.timelimit;
        con.query("UPDATE user SET timelimit='"+tl+"' ,questions='"+noques+"' ",function (err) {
            if (err) console.log("error encountered");
            res.render('quizdetails.ejs');
        })    }
    else {
        res.render('admin.ejs');
    }
});
app.post('/newuserpwd', urlencodedparser, function (req, res, next) {

    if(req.session.a===1){

        var newp=req.body.userpwd;
        con.query("UPDATE user SET password='"+newp+"' ",function (err) {
            if (err) console.log("error encountered");
            res.render('quizdetails.ejs');
        })    }
    else {
        res.render('admin.ejs');
    }
});

app.post('/view', function (req, res, next) {
    if(req.session.a===1){
        res.render('info.ejs');
    }
    else {
        res.render('admin.ejs');
    }});

app.post('/quesc', function (req, res, next) {
    res.render('change.ejs');
});

app.post('/aques', urlencodedparser, function (req, res, next) {

if(req.session.a===1) {
    res.render('adminpage.ejs');
}
else{
    res.render('admin.ejs');
}
});
app.post('/addit', function (req, res) {
    if(req.session.a===1) {
        res.render('add.ejs');
    }
    else{
        res.render('admin.ejs');
    }
})
app.post('/logout', function (req, res) {
    req.session.a=0;
    res.render('firstpage.ejs');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;











