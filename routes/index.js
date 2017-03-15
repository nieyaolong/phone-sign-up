var express = require('express');
var router = express.Router();
var svgCaptcha = require('svg-captcha');

/* GET home page. */
router.get('/', function(req, res, next) {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;

    res.render('index', { title: 'Express', captcha: captcha.data});
});

module.exports = router;
