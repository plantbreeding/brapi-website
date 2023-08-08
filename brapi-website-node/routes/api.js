var express = require('express');
var router = express.Router();
const exval = require('express-validator');
var nodemailer = require('nodemailer');
var fs = require('fs');
const fetch = require('node-fetch');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

router.post('/mailingListSubscribe', function(req, res, next) {
    const now = new Date(Date.now());
    var emailData = {
        from: 'BrAPI Announcements <announcement.test@mail.brapi.org>',
        to: 'announcement.test@mail.brapi.org',
        subject: 'Important: BrAPI Mailing List Update - Message 2 of 2',
        template: 'announcement_template',
        text: 'We are changing to a new mailing server for the BrAPI mailing list. You should receive two messages today: (1) A message from the old server address \"<plant-breeding-api-bounces@mail2.sgn.cornell.edu>\" and (2) THIS message from the new server address \"announcements@mail.brapi.org\". \nCongratulations! If you are reading this, then your address has been successfully migrated to the new system, and your spam filter has been configured correctly to allow messages from \"@mail.brapi.org\". \nThis new mail server should provide more stability and features, as well as making it easier for me to manage news posts and announcements. Moving to the community emails \"mail.brapi.org\" domain will hopefully future-proof the system, so even if the mail server needs to change again, the address will not. Thank you for your patience and cooperation as we make these adjustments. \nIf you do not want to be included on the BrAPI mailing list anymore, you can Unsubscribe here: https://brapi.org/unsubscribe \nCheers \nPeter Selby',
        'h:X-Mailgun-Variables': JSON.stringify({
            "title": "Important: BrAPI Mailing List Update - Message 2 of 2",
            "date": "August 19, 2022",
            "author": "Peter Selby",
            "article": "<p>We are changing to a new mailing server for the BrAPI mailing list. You should receive two messages today: (1) A message from the old server address \"<plant-breeding-api-bounces@mail2.sgn.cornell.edu>\" and (2) THIS message from the new server address \"announcements@mail.brapi.org\". </p><p>Congratulations! If you are reading this, then your address has been successfully migrated to the new system, and your spam filter has been configured correctly to allow messages from \"@mail.brapi.org\".</p><p>This new mail server should provide more stability and features, as well as making it easier for me to manage news posts and announcements. Moving to the community emails \"mail.brapi.org\" domain will hopefully future-proof the system, so even if the mail server needs to change again, the address will not. Thank you for your patience and cooperation as we make these adjustments. </p><p>If you do not want to be included on the BrAPI mailing list anymore, you can <a href=\"https://brapi.org/unsubscribe\">Unsubscribe</a> here: <a href=\"https://brapi.org/unsubscribe\">https://brapi.org/unsubscribe</a></p><p>Cheers<br>Peter Selby</p>"
        }),
        'h:List-Unsubscribe': 'http://brapi.org/unsubscribe',
        'h:Date': now.toUTCString()
    }

    mg.messages.create('mail.brapi.org', emailData)
    .then(msg => console.log(msg)) 
    .catch(err => console.error(err));
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

    fs.appendFile(process.env.NEW_SERVER_LIST_PATH, newServerStr + '\n-------------\n', function(err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/newSoftwareSubmit', function(req, res, next) {
    var newServerStr = JSON.stringify(req.body, null, 4);

    fs.appendFile(process.env.NEW_SERVER_LIST_PATH, newServerStr + '\n-------------\n', function(err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/testEndpoint', async function(req, res, next) {
    var server = req.body;
    var v1URL = server["server-v1-url"]
    var responseBody = { "v1Res": { "status": 0 }, "v2Res": { "status": 0 } };
    if (v1URL) {
        //Production Only Code
        if (v1URL.includes('https://test-server.brapi.org'))
            v1URL = v1URL.replace('https://test-server.brapi.org', 'http://brapi-java-server-v1:8080')
            // ----
        if (!v1URL.endsWith('/'))
            v1URL = v1URL + '/';

        await fetch(v1URL + "calls")
            .then(res => {
                responseBody.v1Res.status = res.status;
            }).catch(error => {
                responseBody.v1Res.status = 400;
            })
    }

    var v2URL = server["server-v2-url"]
    if (v2URL) {
        //Production Only Code
        if (v2URL.includes('https://test-server.brapi.org'))
            v2URL = v2URL.replace('https://test-server.brapi.org', 'http://brapi-java-server-v2:8080')
            // ----
        if (!v2URL.endsWith('/'))
            v2URL = v2URL + '/';

        await fetch(v2URL + "serverinfo")
            .then(res => {
                responseBody.v2Res.status = res.status;
            }).catch(error => {
                responseBody.v2Res.status = 400;
            })
    }

    res.json(responseBody);
});

function newServerJSON(reqBody) {
    var serverBody = {};
    serverBody.name = reqBody.serverName;

    serverBody["v1-url"] = reqBody.serverV1Url;
    if (serverBody["v1-url"] && !serverBody["v1-url"].endsWith('/'))
        serverBody["v1-url"] = serverBody["v1-url"] + '/'

    serverBody["v2-url"] = reqBody.serverV2Url;
    if (serverBody["v2-url"] && !serverBody["v2-url"].endsWith('/'))
        serverBody["v2-url"] = serverBody["v2-url"] + '/'

    serverBody.description = reqBody.serverDesc;
    serverBody["contact-email"] = reqBody.email;
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