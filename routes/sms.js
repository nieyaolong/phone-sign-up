"use strict";

const express = require("express");
const request = require("request");
const moment = require("moment");
const crypto = require('crypto');

const Settings = require("../setting.json");

let router = express.Router();


class RequestResult {

    constructor(response, body) {
        this.response = response;
        this.body = body;
    }

    isSuccess() {
        return (this.response && this.response.statusCode == 200);
    }
}

function requestAsync(options) {
    let reqError = new Error();
    return new Promise((resolve, reject) => {
        request(options, (err, response, body) => {
            if (err) {
                err.message += `##request options:${options} .`;
                err.stack = reqError.stack;
                reject(err);
                return;
            }
            resolve(new RequestResult(response, body));
        });
    })
}

function codeGen() {
    let code = "";
    for (let i = 0; i < 4; i++) {
        let scode = Math.round(Math.random() * 10);
        scode = scode == 10 ? 1 : scode;
        code += scode.toString();
    }
    return code;
}

function genAuthAndSig(sid, token) {
    let timestamp = moment().format("YYYYMMDDHHmmss");
    let md5 = crypto.createHash("md5");
    let sig = md5.update(sid).update(token).update(timestamp).digest("hex").toUpperCase();
    let auth = new Buffer(`${sid}:${timestamp}`).toString("base64");
    return {auth: auth, sig: sig};
}

//短信发送接口
function sendSMSYunTongXunAsync(phone, content) {
    let sid = Settings.SMS.sid;
    let appId = Settings.SMS.appid;
    let token = Settings.SMS.token;
    let templateId = Settings.SMS.template;
    let data = {
        appId: appId,
        to: phone,
        templateId: templateId,
        datas: content
    };
    let authAndSig = genAuthAndSig(sid, token);
    let auth = authAndSig.auth;
    let sig = authAndSig.sig;
    let options = {
        uri: `${Settings.SMS.url}/Accounts/${sid}/SMS/TemplateSMS?sig=${sig}`,
        method: "POST",
        json: true,
        headers: {
            Authorization: auth,
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8"
        },
        body: data
    };

    return requestAsync(options)
        .then(response => {
            let body = response.body;
            console.error(body);
            if (!body || body.statusCode != '000000') {
                switch (body.statusCode) {
                    case '160042':
                        throw new Error('号码格式不对');
                    case '160022':
                        throw new Error('达到发送次数上限');
                    case '160038':
                        throw new Error('发送过于频繁');
                    case '160034':
                        throw new Error('号码为黑名单');
                    default:
                        throw new Error('send sms code request failed');
                }
            }
        });
}

router.post('/', function (req, res) {
    let target = req.session.captcha;
    let captcha=  req.body.captcha;
    if (target && captcha && target.toLowerCase() === captcha.toLowerCase()) {
        let phone = req.body.phone;
        let code = codeGen();
        req.session.sms = code;
        sendSMSYunTongXunAsync(phone, [code,'10分钟'])
            .then(() => {
                res.status(200).send("OK");
            })
            .catch(err => {
                console.log(err);
                res.status(500).send(err.message);
            });
    }else {
        res.status(401).send('failed');
    }
});

module.exports = router;
