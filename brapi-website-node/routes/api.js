var express = require('express');
var router = express.Router();
const exval = require('express-validator');
var nodemailer = require('nodemailer');
var fs = require('fs');

router.post('/mailingListSubscribe', function(req, res, next) {
    fs.appendFile(process.env.MIALING_LIST_PATH, '+ ' + req.body.name + ' (' + req.body.org + ')<' + req.body.email + '>\n', function(err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/mailingListUnsubscribe', function(req, res, next) {
    fs.appendFile(process.env.MIALING_LIST_PATH, '- <' + req.body.email + '>\n', function(err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/newServerSubmit', function(req, res, next) {
    var newServerStr = "";

    if (req.body.existingOrg == "true") {
        newServerStr = "Add to " + req.body.orgsList + "\n";
        newServerStr += JSON.stringify(newServerJSON(req.body), null, 4)
    } else {
        var newOrg = {};
        newOrg.name = req.body.orgName;
        newOrg.logo = req.body.orgLogo;
        newOrg.description = req.body.orgDesc;
        newOrg.resources = [];
        newOrg.resources.push(newServerJSON(req.body));
        newServerStr = "New Org\n";
        newServerStr += JSON.stringify(newOrg, null, 4)
    }
    console.log("json " + newServerStr);
    console.log("file " + process.env.NEW_SERVER_LIST_PATH)

    fs.appendFile(process.env.NEW_SERVER_LIST_PATH, newServerStr + '\n-------------\n', function(err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

function newServerJSON(reqBody) {
    var serverBody = {};
    serverBody.name = reqBody.serverName;
    serverBody["base-url"] = reqBody.serverBaseUrl;
    serverBody.description = reqBody.serverDesc;
    serverBody.badges = [];
    for (var field in reqBody) {
        if (field.startsWith("badge")) {
            serverBody.badges.push(reqBody[field]);
        }
    }
    return serverBody;
}

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