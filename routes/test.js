var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var HashMap = require('hashmap');
var map = new HashMap();
var currentnum;
router.use(bodyParser.urlencoded({extended: false}));
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"bru",
    dateStrings : 'date'
});

connection.connect(function (err) {
    if (err) throw err;
});
router.get('/', function (req, res, next) {

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    req.session.abc2=false;
    if(req.session.abc1){
        req.session.ques = [];
        var r = req.session.rano;
        currentnum = req.query.questionnumber;
        if (parseInt(currentnum) > req.session.qlimit ) {
            res.redirect("/test?questionnumber=" + req.session.qlimit);
        }
        if(parseInt(currentnum) < 0){
            res.redirect("/test?questionnumber=1")
        }
        module.exports.curque = req.body.que;
        function a(callback) {
            for (var i = 0; i < req.session.qlimit; i++) {
                map.set(i + 1, r[i]);
            }
            req.session.hmap = map;
            callback();
        }

        a(function () {
            connection.query("SELECT * FROM "+req.session.dep+"_question_list;", function (err, rows, fields) {
                if (!err) {
                    function search(callback2) {
                        var qum = [];
                        req.session.hmap.forEach(function (value, key) {
                            qum.push(rows[value - 1].question);
                            if (parseInt(key) === parseInt(currentnum)) {
                                callback2(value);
                            }
                        });
                        req.session.qum = qum;
                        console.log(req.session.qum);
                    }

                    search(function (m) {
                        var qu = rows[m - 1].question;
                        var op1 = rows[m - 1].ans1;
                        var op2 = rows[m - 1].ans2;
                        var op3 = rows[m - 1].ans3;
                        var op4 = rows[m - 1].ans4;
                        var ans = rows[m - 1].correct;
                        var a = parseInt(currentnum) + 1;
                        var b = parseInt(currentnum) - 1;
                        res.render('test', {
                            questionnum: req.query.questionnumber,
                            question: qu,
                            option1: op1,
                            option2: op2,
                            option3: op3,
                            option4: op4,
                            ans: ans,
                            a: a,
                            b: b,
                            r: req.session.qlimit
                        });
                    });
                }
                else
                    console.log('Error while performing Query.');
            });
        });
    }
    else res.redirect('/');
});


module.exports = router;