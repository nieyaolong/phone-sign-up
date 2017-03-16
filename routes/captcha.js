"use strict";
const express = require('express');
const svgCaptcha = require('svg-captcha');

let router = express.Router();

router.get('/', function (req, res) {
    let captcha = svgCaptcha.create({ignoreChars: '0oO1iIl'});
    req.session.captcha = captcha.text;

    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(captcha.data);
});

module.exports = router;
