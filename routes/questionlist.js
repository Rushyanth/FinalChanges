var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"bru",
    dateStrings : 'date'
});
con.connect(function (err) {
    if (err) throw err;

});
var questions =[];
var option1 =[];
var option2 =[];
var option3 =[];
var option4 =[];
var correct = [];
var qno = [];
var count;
var dept;
router.get('/admin/questionlist/:dept', function (req, res, next) {
    console.log(req.params.dept);
    dept = req.params.dept;

    generateQuestionList();

    setTimeout(function () {
        res.render('questionlist',{
            dept : req.params.dept,
            questions : questions,
            count : count,
            option1 : option1,
            option2 : option2,
            option3 : option3,
            option4 : option4,
            correct : correct,
            qno : qno

        });
    },500);

});

function generateQuestionList() {

    con.query("select count(*) as count from "+dept+"_question_list ;", function (err, result2) {
        if (err) throw err;
        console.log(result2);

        count =result2[0].count;

    });
    con.query("select *  from "+dept+"_question_list ;", function (err, result) {
        if (err) throw err;
        console.log(result);
        for(var i=0;i<count;i++)
        {
            questions[i]=result[i].question;
            option1[i] = result[i].ans1;
            option2[i] = result[i].ans2;
            option3[i] = result[i].ans3;
            option4[i] = result[i].ans4;
            correct[i] = result[i].correct;
            qno[i] = result[i].no;
            console.log(questions[i]);
        }


    });
}



module.exports = router;