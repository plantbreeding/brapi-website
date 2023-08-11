
const { Issuer, generators, custom } = require('openid-client');

const discoveryUri = 'http://keycloak-brapi:8080/auth/realms/brapi/'; //production
const redirectUri = 'https://brapi.org/oauth/redirect';               //production

// const discoveryUri = 'https://test-server.brapi.org/';       //development
// const redirectUri = 'http://localhost:3000/oauth/redirect';  //development

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
                client_id: 'exampleClient',
                client_secret:  process.env.OAUTH_EXAMPLE_CLIENT_SECRET,
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
module.exports = router;