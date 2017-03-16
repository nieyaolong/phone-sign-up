"use strict";

const express = require('express');
const svgCaptcha = require('svg-captcha');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;

    res.render('index', { title: 'Express', captcha: captcha.data});
});

module.exports = router;
