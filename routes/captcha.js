"use strict";
const express = require('express');
const svgCaptcha = require('svg-captcha');

var router = express.Router();

router.get('/', function (req, res) {
    var captcha = svgCaptcha.create({ignoreChars: '0oO1iIl', fontSize:30,  width:50, height:20});
    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

module.exports = router;
