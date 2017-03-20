"use strict";
const express = require('express');
const svgCaptcha = require('svg-captcha');

var router = express.Router();

router.get('/', function (req, res) {
    var size = req.query.size ? req.query.size : 30;
    console.error(size);
    var captcha = svgCaptcha.create({ignoreChars: '0oO1iIl', fontSize:size,  width:size * 2, height:size});
    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

module.exports = router;
