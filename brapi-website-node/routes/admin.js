var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require('path');
const { Issuer, generators, custom } = require('openid-client');

// const discoveryUri = 'http://keycloak-brapi:8080/auth/realms/brapi/'; //production
// const redirectUri = 'https://brapi.org/admin/redirect';               //production

const discoveryUri = 'https://test-server.brapi.org/';       //development
const redirectUri = 'http://localhost:3000/admin/redirect';  //development

var client;
var code_verifier = generators.codeVerifier();
buildOauthClient();

function buildOauthClient() {
    custom.setHttpOptionsDefaults({
        timeout: 10000,
    });
    return Issuer.discover(discoveryUri) // => Promise .well-known/openid-configuration
        .then(function(issuerResponse) {
            console.log('Discovered issuer %s %O', issuerResponse.issuer, issuerResponse.authorization_endpoint);

            client = new issuerResponse.Client({
                client_id: 'brapi-org-admin',
                client_secret:  process.env.OAUTH_BRAPI_ADMIN_CLIENT_SECRET,
                redirect_uris: [redirectUri],
                response_types: ['code']
                // response_types: ['id_token'],
            }); // => Client
        })
        .catch((err) => console.log(err.message));
}

router.get('/', function(req, res, next) {
    
    res.render('oauth', {
        title: 'OAuth',
        footerEvents: require('./events').getTrailerEvents()
    });
});

router.get('/login', function(req, res, next) {
    const code_challenge = generators.codeChallenge(code_verifier);

    const nonce = generators.nonce();
    var authURL = client.authorizationUrl({
        scope: 'openid email profile',
        code_challenge,
        code_challenge_method: 'S256',
    });
    res.redirect(authURL);
});


router.get('/redirect', function(req, res, next) {
    const params = client.callbackParams(req);
    client.callback(redirectUri, params, {code_verifier})
    .then(function(tokenSet) {
        console.log('received and validated tokens %j', tokenSet);
        console.log('validated ID Token claims %j', tokenSet.claims());
        
        res.render('oauth', {
            email: tokenSet.claims().email,
            name: tokenSet.claims().name,
            token: tokenSet.access_token,
            title: 'OAuth',
            footerEvents: require('./events').getTrailerEvents()
        });
    })
    .catch((err) => {
        console.log(err.message);

        res.render('oauth', {
            title: 'OAuth',
            footerEvents: require('./events').getTrailerEvents()
        });
    });
    
});

router.get('/', function(req, res, next) {
    var providers = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/json/brapi-resources.json'), 'utf-8'));
    const regThe = /^[tT]he /
    providers.sort(function(a, b) {
        var aName = a.name.replace(regThe, '');
        var bName = b.name.replace(regThe, '');
        return aName > bName ? 1 : ((bName > aName) ? -1 : 0);
    });

    for (prov of providers) {
        for (server of prov.resources) {
            server['id'] = server.name.replace(/[ :/\(\)\.]/ig, '');
            var badgesArr = [];
            for (badgeKey of server.badges) {
                badgesArr.push(badges[badgeKey]);
            }
            server.badges = badgesArr;
        }
    }

    res.render('servers', {
        title: 'Servers',
        footerEvents: require('./events').getTrailerEvents(),
        providers: providers
    });
});

router.get('/submit', function(req, res, next) {
    var providers = require('../public/json/brapi-resources.json');
    providers.sort(function(a, b) {
        return a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0);
    });

    res.render('serversSubmit', {
        title: 'Servers',
        footerEvents: require('./events').getTrailerEvents(),
        providers: providers,
        badges: badges
    });
});

module.exports = router;