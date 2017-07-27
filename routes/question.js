var express = require('express');
var router = express.Router();
var url = require('url');
var mysql = require('mysql');
var session = require('express-session');
var HashMap = require('hashmap');
var correctans=[];
router.get('/', function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if(!req.session.abc1) req.session.abc1=true;
    if(!req.session.abc2) req.session.abc2=true;
    if(req.session.abc1){
        if(!req.session.i) req.session.i=true;
        if(req.session.i=true){
            var connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "root",
                database:"bru"
            });
            function con(callback) {

                connection.connect(function (err) {
                    if (err) throw err;
                    connection.query('SELECT * FROM user;',function (err,row,fields) {
                        if (!err){
                            req.session.qlimit=row[0].questions;
                            req.session.tlimit=row[0].timelimit;
                            connection.query('SELECT * FROM '+req.session.dep+'_question_list;', function (err, rows, fields) {
                                if (!err) {
                                    function rando(n,callback) {
                                        var randnumber = [];
                                        var i = 0;
                                        while (i < req.session.qlimit) {
                                            var m = Math.floor((Math.random() * n) + 1);
                                            function check(m, randnumber) {
                                                var a = 0;
                                                for (var i = 0; i < randnumber.length; i++) {
                                                    if (m === randnumber[i]) {
                                                        a = 1;
                                                        break;
                                                    }
                                                }
                                                if (a === 0)return 1;
                                                else return 0;
                                            }

                                            if (check(m, randnumber)) {
                                                randnumber.push(m);
                                                i++;
                                            }
                                        }
                                        callback(randnumber);
                                    }
                                    rando(parseInt(rows.length),function (rn) {
                                        req.session.rano = rn;
                                        var ran=req.session.rano;
                                        function abc(call) {
                                            for (var i = 0; i < req.session.qlimit; i++) {
                                                correctans.push(rows[ran[i] - 1].correct);
                                            }
                                            call();
                                        }
                                        abc(function () {
                                            req.session.cora=correctans;
                                            console.log(req.session.rano);
                                            console.log(req.session.cora);
                                            correctans=[];
                                        });
                                    });
                                }
                                else
                                    console.log('Error while performing Query.');
                                callback();
                            });
                        }
                        else
                            console.log('Error while performing Query.');
                    });

                });
            }
            con(function () {
                res.render('question', {
                    rand: req.session.rano,
                    num:req.session.qlimit,
                    tlimit:req.session.tlimit
                });
            });
        }
        else {
            res.redirect('/');
        }

    }else res.redirect("/test?questionnumber=" + req.session.qlimit);
});


module.exports = router;