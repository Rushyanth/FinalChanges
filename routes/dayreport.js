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

var date ;
var sql ="";
var dept ;
router.get('/adminDayReport/:dept' ,function (req,res) {
    date = req.query.seldate;
    dept = req.params.dept;
    var nn=[],nm=[],ne=[],nr=[],nd=[],c;

    con.query("select * from "+dept+" where date like '%"+date+"%' ",function (err,result) {
        if(err) console.log("error");
        console.log("=--------------------------------------------------------------------------------------------------");
        console.log(result);
        c=result.length;

        for(var i=0;i<c;i++) {
            nd[i] = result[i].date;
            nn[i] = result[i].name;
            nm[i] = result[i].mobile;
            ne[i] = result[i].email;
            nr[i] = result[i].result;
        }
        res.render('dayreport',{
            c:c,
            date:date,
            name:nn,
            email:ne,
            mobile:nm,
            resu:nr
        });

    });


});

module.exports = router;