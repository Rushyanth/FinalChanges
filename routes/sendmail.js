var nodemailer = require('nodemailer');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"bru",
    dateStrings : 'date'
});

var exports=module.exports={};

var reqmail,reqpwd,requr;

exports.sendmail=function (i) {

    con.query("select email,password,username from admins where id="+i+"  ", function (err, result, fields) {
        if (err) console.log("error encountered");
        reqmail=result[0].email;
        reqpwd=result[0].password;
        requr=result[0].username;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'msrmhQuizHelp@gmail.com',
                pass: 'msrmhQuizHelp'
            }
        });
        var mailOptions = {
            from: 'msrmhQuizHelp@gmail.com',
            to:''+reqmail+'',
            subject: 'Password details',
            text: 'Your user name : ' + requr + ' and Password :   ' + reqpwd + '  '
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
        });

    });
};
