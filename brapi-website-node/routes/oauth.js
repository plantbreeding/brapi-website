var express = require('express');
var router = express.Router();

// const discoveryUri = 'http://keycloak-brapi:8080/auth/realms/brapi/'; //production
// const redirectUri = 'https://brapi.org/oauth/redirect';               //production

const discoveryUri = process.env.DISCOVERY_URI;
const redirectUri = process.env.OAUTH_REDIRECT_URI;

const authUtils = require('./auth-util');
var OAuthClient;
authUtils.buildAuthClient(discoveryUri, redirectUri, 'exampleClient', process.env.OAUTH_EXAMPLE_CLIENT_SECRET, 
(client) => OAuthClient = client);

router.get('/', function(req, res, next) {
    res.render('oauth', {
        title: 'OAuth',
        footerEvents: require('./events').getTrailerEvents()
    });
});

router.get('/login', function(req, res, next) {
    res.redirect(authUtils.getAuthURL(OAuthClient));
});

router.get('/redirect', async function(req, res, next) {
    var token = await authUtils.verifyTokenResponse(OAuthClient, req, redirectUri);
    if(token){
        res.render('oauth', {
            email: token.claims().email,
            name: token.claims().name,
            token: token.access_token,
            title: 'OAuth',
            footerEvents: require('./events').getTrailerEvents()
        });
    }else{
        res.render('oauth', {
            title: 'OAuth',
            footerEvents: require('./events').getTrailerEvents()
        });
    }    
});
module.exports = router;