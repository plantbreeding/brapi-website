var express = require('express');
var router = express.Router();

const { Issuer, generators, custom } = require('openid-client');
var client;

function buildOauthClient() {
    custom.setHttpOptionsDefaults({
        timeout: 10000,
    });
    //return Issuer.discover('https://test-server.brapi.org/brapi/auth/') // => Promise
    return Issuer.discover('http://keycloak-brapi:8080/auth/realms/brapi/') // => Promise .well-known/openid-configuration
        .then(function(issuerResponse) {
            console.log('Discovered issuer %s %O', issuerResponse.issuer, issuerResponse.authorization_endpoint);

            client = new issuerResponse.Client({
                client_id: 'exampleClient',
                //redirect_uris: ['http://localhost:3000/oauth/redirect'],
                redirect_uris: ['https://brapi.org/oauth/redirect'],
                //response_types: ['code']
                response_types: ['token'],
            }); // => Client
        });
}

router.get('/', function(req, res, next) {
    res.render('oauth', {
        title: 'OAuth',
        footerEvents: require('./events').getTrailerEvents()
    });
});

router.get('/login', function(req, res, next) {
    buildOauthClient().then(function() {
        const nonce = generators.nonce();
        var authURL = client.authorizationUrl({
            scope: 'profile',
        });
        res.redirect(authURL);
    });
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