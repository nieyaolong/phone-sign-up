"use strict";

const express = require('express');
const svgCaptcha = require('svg-captcha');
const db = require('sqlite');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;

    res.render('index', {captcha: captcha.data});
});

function signUpAsync(info) {
    let dbFile = './db.sqlite';
    return db.open(dbFile)
        .then(() => {
            return db.migrate();
        })
        .then(() => {
            return db.run(`INSERT INTO USER (name, phone, major, score) VALUES ("${info.name}", "${info.phone}", "${info.major}", "${info.score}")`);
        })
        .then(() => {
            db.close();
        });
}

router.post('/', function (req, res, next) {
    let phone = req.body.phone;
    let name = req.body.name;
    let code = req.body.code;
    let major = req.body.major;
    let score = req.body.score;

    let sessionPhone = req.session.phone;
    let sessionCode = req.session.code;

    if (!name) {
        res.status(400).send('Bad Name');
        return;
    }


    if (!(phone && sessionPhone && phone === sessionPhone)) {
        res.status(400).send('Bad Phone');
        return;
    }

    if (!(code && sessionCode && code === sessionCode)) {
        res.status(400).send('Bad Code');
        return;
    }
    let regInfo = {
        name: name,
        phone: phone,
        major: major,
        score: score
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
