var express = require('express');
var router = express.Router();

const { Issuer, generators, custom } = require('openid-client');
var client;

function buildOauthClient() {
    custom.setHttpOptionsDefaults({
        timeout: 5000,
    });
    return Issuer.discover('https://test-server.brapi.org/brapi/auth/') // => Promise
        .then(function(issuerResponse) {
            console.log('Discovered issuer %s %O', issuerResponse.issuer, issuerResponse.authorization_endpoint);

            client = new issuerResponse.Client({
                client_id: 'exampleClient',
                redirect_uris: ['http://localhost:3000/oauth/redirect'],
                //response_types: ['code']
                response_types: ['token'],
            }); // => Client
        });
}

router.get('/', function(req, res, next) {
    buildOauthClient().then(function() {
        res.render('oauth', {
            title: 'OAuth',
            footerEvents: require('./events').getTrailerEvents()
        });
    });
});

router.get('/login', function(req, res, next) {
    const nonce = generators.nonce();
    var authURL = client.authorizationUrl({
        scope: 'profile',
    });
    res.redirect(authURL);
});


router.get('/redirect', function(req, res, next) {
    buildOauthClient().then(function() {
        res.render('oauth', {
            title: 'OAuth',
            footerEvents: require('./events').getTrailerEvents()
        });
    });
});
module.exports = router;