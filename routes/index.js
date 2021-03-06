"use strict";

const express = require('express');
const svgCaptcha = require('svg-captcha');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;

    res.render('index', { title: 'Phone Sign up', captcha: captcha.data});
});

function signUpAsync(info) {
    return new Promise((resolve, reject) => {
        console.error(info);
        return resolve();
    });
}

router.post('/', function(req, res, next) {
    let phone = req.body.phone;
    let name = req.body.name;
    let code = req.body.code;

    let sessionPhone = req.session.phone;
    let sessionCode = req.session.code;

    if(!name) {
        res.status(400).send('Bad Name');
        return;
    }


    if(!(phone && sessionPhone && phone === sessionPhone)) {
        res.status(400).send('Bad Phone');
        return;
    }

    console.error(`${code}, ${sessionCode}`);
    if(!(code && sessionCode && code === sessionCode)) {
        res.status(400).send('Bad Code');
        return;
    }
    let regInfo = {
        name: name,
        phone: phone,
    };
    signUpAsync(regInfo)
        .then(() => {
            res.status(200).send('OK');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err.message);
        })
});


module.exports = router;
