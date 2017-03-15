var express = require('express');

var router = express.Router();

router.post('/', function (req, res) {
    var captcha = req.session.captcha;
    console.error(req.session ,req.body.captcha);
    if(!captcha || captcha !== req.body.captcha) {
        res.status(401).send('failed');
        return;
    }
    var phone = req.body.phone;
    console.error(phone);

    //sms api
    res.status(200).send('success');
});

module.exports = router;
