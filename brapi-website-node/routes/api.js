var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var nodemailer = require('nodemailer');
var fs = require('fs');

router.post('/mailingListSubscribe', function(req, res, next) {
    const errors = validationResult(req);
    fs.appendFile(process.env.MIALING_LIST_PATH, '+ ' + req.body.name + ' (' + req.body.org + ')<' + req.body.email + '>\n', function(err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/mailingListUnsubscribe', function(req, res, next) {
    const errors = validationResult(req);
    fs.appendFile(process.env.MIALING_LIST_PATH, '- <' + req.body.email + '>\n', function(err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});


// Google blocked for security reasons
// TODO try again with MailGun
function sendNotification(params) {
    var pass = process.env.MAIL_SERVER_PASS;
    console.log(pass);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'brapicoordinatorselby@gmail.com',
            pass: pass
        }
    });

    var mailOptions = {
        from: 'brapicoordinatorselby@gmail.com',
        to: 'brapicoordinatorselby@gmail.com, ' + params.email,
        subject: 'BrAPI Mailing List Subscription',
        text: 'Thank you for subscribing to the BrAPI Mailing List!'
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;