var express = require('express');
var router = express.Router();
var fs = require('fs');
const fetch = require('node-fetch');
const authUtils = require('./auth-util');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

router.post('/mailingListSubscribe', function (req, res, next) {
    const now = new Date(Date.now());
    var emailData = {
        from: 'BrAPI Mailing List <mail@mail.brapi.org>',
        to: [req.body.email, 'mail@mail.brapi.org'],
        subject: 'Welcome to the BrAPI Mailing List',
        template: 'announcement_template',
        text: 'Hello ' + req.body.name + '\nThank you for joining the BrAPI Community Mailing List. This list is the best way to stay up to date with the BrAPI community. Also, please consider joining the community Slack workspace and following us on Twitter/X.\nYou can Unsubscribe at any time by going to: https://brapi.org/unsubscribe\n\nCheers\nPeter Selby\nBrAPI Project Coordinator',
        'h:X-Mailgun-Variables': JSON.stringify({
            "title": "Welcome to the BrAPI Mailing List",
            "date": now.toDateString,
            "author": null,
            "article": "<p>Hello " + req.body.name + "</p><p>Thank you for joining the BrAPI Community Mailing List. This list is the best way to stay up to date with the BrAPI community. Also, please consider joining the community <a href=\"https://join.slack.com/t/plantbreedingapi/shared_invite/enQtNjA4NTA3OTI5NjUxLWE5ZmI0NDE0NGM1ODkxMjVmMDU1MGVjY2Q5M2QxNGNkYzMyODhkNDVmZjM0ZGI1YzEwYjEwNmY0MDM1YjllZDU\">Slack workspace</a> and following us on <a href=\"https://twitter.com/breedingapi\">Twitter/X</a>.</p><p>You can <a href=\"https://brapi.org/unsubscribe\">Unsubscribe</a> at any time by going to: <a href=\"https://brapi.org/unsubscribe\">https://brapi.org/unsubscribe</a></p><p>Cheers<br>Peter Selby<br>BrAPI Project Coordinator</p>"
        }),
        'h:List-Unsubscribe': 'http://brapi.org/unsubscribe',
        'h:Date': now.toUTCString()
    }

    mg.lists.members.createMember('announcements@mail.brapi.org', {
        address: req.body.email,
        name: req.body.name + ' (' + req.body.org + ')', // optional, modifiable on website
        vars: { organization: req.body.org }, // optional, modifiable on website
        subscribed: 'yes', // optional, modifiable on website
        upsert: 'yes', // optional, choose yes to insert if not exist, or update it exist
    })
        .then(data => {
            console.log(data);

            mg.messages.create('mail.brapi.org', emailData)
                .then(msg => console.log(msg))
                .catch(err => console.error(err));
        }) // logs response body
        .catch(err => console.error(err)); // logs any error

    fs.appendFile(process.env.MIALING_LIST_PATH, '+ ' + req.body.name + ' (' + req.body.org + ')<' + req.body.email + '>\n', function (err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/mailingListUnsubscribe', function (req, res, next) {
    const now = new Date(Date.now());
    var emailData = {
        from: 'BrAPI  Mailing List <mail@mail.brapi.org>',
        to: [req.body.email, 'mail@mail.brapi.org'],
        subject: 'Unsubscribed from the BrAPI Mailing List',
        template: 'announcement_template',
        text: 'Hello ' + req.body.email + '\nYou have been unsubscribed from the BrAPI Community Mailing List. \nYou can resubscribe at any time by going to: https://brapi.org/contact\n\nCheers\nPeter Selby\nBrAPI Project Coordinator',
        'h:X-Mailgun-Variables': JSON.stringify({
            "title": "Unsubscribed from the BrAPI Mailing List",
            "date": now.toDateString,
            "author": null,
            "article": '<p>Hello ' + req.body.email + '</p><p>You have been unsubscribed from the BrAPI Community Mailing List. You can resubscribe at any time by going to: <a href=\"https://brapi.org/contact\">https://brapi.org/contact</a></p><p>Cheers<br>Peter Selby<br>BrAPI Project Coordinator</p>'
        }),
        'h:List-Unsubscribe': 'http://brapi.org/unsubscribe',
        'h:Date': now.toUTCString()
    }

    mg.lists.members.destroyMember('announcements@mail.brapi.org', req.body.email)
        .then(data => {
            console.log(data);
            mg.messages.create('mail.brapi.org', emailData)
                .then(msg => console.log(msg))
                .catch(err => console.error(err));
        }) // logs response body
        .catch(err => console.error(err)); // logs any error

    fs.appendFile(process.env.MIALING_LIST_PATH, '- <' + req.body.email + '>\n', function (err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/newServerSubmit', function (req, res, next) {
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

    const now = new Date(Date.now());
    var emailData = {
        from: 'New Software <software@mail.brapi.org>',
        to: ['software@mail.brapi.org', req.body.email],
        template: 'announcement_template',
        subject: 'New BrAPI software to review',
        text: 'New BrAPI software to review\n\n\n' + newServerStr,
        'h:X-Mailgun-Variables': JSON.stringify({
            "title": 'New BrAPI software to review',
            "date": null,
            "author": null,
            "article": newServerStr.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;')
        }),
        'h:List-Unsubscribe': 'http://brapi.org/unsubscribe',
        'h:Date': now.toUTCString()
    }

    mg.messages.create('mail.brapi.org', emailData)
        .then(msg => console.log(msg))
        .catch(err => console.error(err));

    fs.appendFile(process.env.NEW_SERVER_LIST_PATH, newServerStr + '\n-------------\n', function (err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/newSoftwareSubmit', function (req, res, next) {
    var newServerStr = JSON.stringify(req.body, null, 4);

    const now = new Date(Date.now());
    var emailData = {
        from: 'New Software <software@mail.brapi.org>',
        to: ['software@mail.brapi.org', req.body.email],
        template: 'announcement_template',
        subject: 'New BrAPI software to review',
        text: 'New BrAPI software to review\n\n\n' + newServerStr,
        'h:X-Mailgun-Variables': JSON.stringify({
            "title": 'New BrAPI software to review',
            "date": null,
            "author": null,
            "article": newServerStr.replace(/\n/g, '<br>').replace(/  /g, '&nbsp;')
        }),
        'h:List-Unsubscribe': 'http://brapi.org/unsubscribe',
        'h:Date': now.toUTCString()
    }

    mg.messages.create('mail.brapi.org', emailData)
        .then(msg => console.log(msg))
        .catch(err => console.error(err));

    fs.appendFile(process.env.NEW_SERVER_LIST_PATH, newServerStr + '\n-------------\n', function (err) {
        if (err) throw err;
        res.json({ "success": "true" })
    });
});

router.post('/announcement', function (req, res, next) {
    const discoveryUri = process.env.DISCOVERY_URI;

    var token = req.headers.authorization;

    if (token) {
        token = token.replace('Bearer ', '')
        authUtils.verifyToken(token, discoveryUri, { subject: 'd24ee1e8-a2e4-4980-8f9d-b959decfc456', audience: ['account', 'brapi-org-admin'] })
            .then(() => {

                const now = new Date(Date.now());
                
                var emailArticle = req.body.article
                .replace(/<img/g, '<table> <tr> <td valign="top" align="center"> <img width="520" height="130" alt="Alt" border="0" style="display:block; max-width:520px;" ')
                .replace(/><\/img>/g, '/> </td> </tr> </table>')
                .replace(/src="\//g, 'src="https://brapi.org/')
                .replace(/href="\//g, 'href="https://brapi.org/');

                var emailData = {
                    from: 'BrAPI Announcements <' + process.env.ANNOUNCEMENT_EMAIL_ADDR + '>',
                    to: process.env.ANNOUNCEMENT_EMAIL_ADDR,
                    template: 'announcement_template',
                    subject: req.body.title,
                    text: req.body.text,
                    'h:X-Mailgun-Variables': JSON.stringify({
                        "title": req.body.title,
                        "date": req.body.date,
                        "author": req.body.author,
                        "article": emailArticle
                    }),
                    'h:List-Unsubscribe': 'http://brapi.org/unsubscribe',
                    'h:Date': now.toUTCString()
                }

                mg.messages.create('mail.brapi.org', emailData)
                    .then(msg => {
                        console.log(msg);
                        res.json({ "success": true, "message": msg });
                    })
                    .catch(err => {
                        console.error(err);
                        res.json({ "success": false, "error": err });
                    });
            })
            .catch(err => {
                console.log(err);
                res.json({ "success": false, "error": err });
            });
    } else {
        var err = 'Auth token invalid';
        console.error(err);
        res.json({ "success": false, "error": err });
    }

});

router.post('/testEndpoint', async function (req, res, next) {
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

module.exports = router;