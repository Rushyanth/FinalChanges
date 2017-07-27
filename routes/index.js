var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/index', function(req, res, next) {

  res.render('index',{});
});

module.exports = router;
