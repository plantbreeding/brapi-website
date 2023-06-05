var express = require('express');
var router = express.Router();
const fs = require('fs')
const path = require('path');

var badges = {
    "auth-open": { "badge-text": "No Auth", "badge-icon-class": "mdi-lock-open-variant", "badge-color": "#00748C" },
    "auth-required": { "badge-text": "Auth Required", "badge-icon-class": "mdi-lock", "badge-color": "#00288c" },
    "data-prod": { "badge-text": "Real Data", "badge-icon-class": "mdi-database-check", "badge-color": "#8c7000" },
    "data-demo": { "badge-text": "Demo Data", "badge-icon-class": "mdi-database-remove", "badge-color": "#8c4d00" },
    "brapi-v1": { "badge-text": "BrAPI V1", "badge-icon-class": "mdi-numeric-1-circle", "badge-color": "#006633" },
    "brapi-v2": { "badge-text": "BrAPI V2", "badge-icon-class": "mdi-numeric-2-circle", "badge-color": "#446100" }
}

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