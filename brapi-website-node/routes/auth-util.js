
const { Issuer, generators, custom } = require('openid-client');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const fetch = require('node-fetch');
const util = require('util');

const code_verifier = generators.codeVerifier();

function buildAuthClient(discoveryUri, redirectUri, clientId, clientSecret, clientCallBack) {
  custom.setHttpOptionsDefaults({
    timeout: 10000,
  });
  return Issuer.discover(discoveryUri) // => Promise .well-known/openid-configuration
    .then(function (issuerResponse) {
      // console.log('Discovered issuer %s %O', issuerResponse.issuer, issuerResponse.authorization_endpoint);

      client = new issuerResponse.Client({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [redirectUri],
        response_types: ['code']
        // response_types: ['id_token'],
      }); // => Client
      clientCallBack(client);
    })
    .catch((err) => console.log(err.message));
}

function getAuthURL(client) {
  const code_challenge = generators.codeChallenge(code_verifier);
  var authURL = client.authorizationUrl({
    scope: 'openid email profile',
    code_challenge,
    code_challenge_method: 'S256',
  });
  return authURL;
};

async function verifyTokenResponse(client, req, redirectUri) {
  const params = client.callbackParams(req);
  var token = await client.callback(redirectUri, params, { code_verifier }).catch((err) => console.log(err.message));
  // console.log('received and validated tokens %j', token);
  // console.log('validated ID Token claims %j', token.claims());

  return token;
}


async function fetchJwksUri(issuer) {
  const response = await fetch(`${issuer}/.well-known/openid-configuration`);
  const { jwks_uri } = await response.json();
  return jwks_uri;
};

const getKey = (jwksUri) => (header, callback) => {
  const client = jwksClient({ jwksUri });
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.log(err);
      return callback(err);
    }
    callback(null, key.publicKey || key.rsaPublicKey);
  });
};

async function verifyToken(token, discoveryUri, options) {
  if ('roles' in options) {
    if (!Array.isArray(options.roles)) {
      options.roles = [options.roles];
    }
    const decoded = jwt.decode(token, { complete: true });
    const tokenRoles = decoded.payload.realm_access ? decoded.payload.realm_access.roles : [];
    tokenRoles.push(...(decoded.payload.resource_access && decoded.payload.resource_access[options.resource] ? decoded.payload.resource_access[options.resource].roles : []));
    const hasRoles = options.roles.every(role => tokenRoles.includes(role));
    if (!hasRoles) {
      return Promise.reject(new Error('Token does not have required roles'));
    }
  }

  const jwksUri = await fetchJwksUri(discoveryUri);
  return util.promisify(jwt.verify)(token, getKey(jwksUri), options || {});
};

module.exports = {
  buildAuthClient: buildAuthClient,
  getAuthURL: getAuthURL,
  verifyTokenResponse: verifyTokenResponse,
  verifyToken: verifyToken
};