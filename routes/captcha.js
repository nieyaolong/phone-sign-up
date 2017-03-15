var express = require('express');
var svgCaptcha = require('svg-captcha');

var router = express.Router();

router.get('/', function (req, res) {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

module.exports = router;
