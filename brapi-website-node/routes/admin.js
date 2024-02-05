var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require('path');

// const discoveryUri = 'http://keycloak-brapi:8080/auth/realms/brapi/'; //production
// const redirectUri = 'https://brapi.org/admin/redirect';               //production

const discoveryUri = process.env.DISCOVERY_URI;
const redirectUri = process.env.ADMIN_REDIRECT_URI;

const authUtils = require('./auth-util');
var OAuthClient;
authUtils.buildAuthClient(discoveryUri, redirectUri, 'brapi-org-admin', process.env.OAUTH_BRAPI_ADMIN_CLIENT_SECRET, 
(client) => OAuthClient = client);

router.get('/', async function (req, res, next) {
    var token = req.cookies['access_token']; 
    await renderAdmin(res, token);
});

router.get('/login', function (req, res, next) {
    res.redirect(authUtils.getAuthURL(OAuthClient));
});

router.get('/redirect', async function (req, res, next) {
    var token = await authUtils.verifyTokenResponse(OAuthClient, req, redirectUri);
    if (token) {
        authUtils.verifyToken(token.access_token, discoveryUri, {audience: ['account', 'brapi-org-admin']})
        .then(() => {
            res.cookie('access_token', token.access_token, {maxAge: 2 * 3600000, secure: true, path:'/admin'});
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin');
        });
    }else{
        res.redirect('/admin');
    }
});

async function renderAdmin(res, token) {
    if (token) {
        authUtils.verifyToken(token, discoveryUri, {audience: ['account', 'brapi-org-admin']})
        .then(() => {
            res.render('admin', {
                title: 'Admin',
                footerEvents: require('./events').getTrailerEvents(),
                authorized: true,
                emailTO: process.env.ANNOUNCEMENT_EMAIL_ADDR,
                emailFROM: 'BrAPI Announcements <' + process.env.ANNOUNCEMENT_EMAIL_ADDR + '>'
            });
        })
        .catch(err => {
            console.log(err);
            res.render('admin', {
                title: 'Admin',
                footerEvents: require('./events').getTrailerEvents(),
                authorized: false,
            });
        });
    } else {
        res.render('admin', {
            title: 'Admin',
            footerEvents: require('./events').getTrailerEvents(),
            authorized: false,
        });
    }
}

module.exports = router;