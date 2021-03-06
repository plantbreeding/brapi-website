var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'BrAPI',
        footerEvents: require('./events').getTrailerEvents(),
        isHomePage: true
    });
});

router.get('/partners', function(req, res, next) {
    var partners = require('../public/json/partners.json')
    partners.sort(function(a, b) {
        return a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0);
    });
    res.render('partners', {
        title: 'Partners',
        footerEvents: require('./events').getTrailerEvents(),
        partners: partners
    });
});

router.get('/specification', function(req, res, next) {
    res.render('specification', {
        title: 'BrAPI Specification',
        footerEvents: require('./events').getTrailerEvents()
    });
});

router.get('/documentation', function(req, res, next) {
    renderLinksPage('Documentation', 'doc', res);
});

router.get('/libraries', function(req, res, next) {
    renderLinksPage('Libraries', 'lib', res);
});

router.get('/tools', function(req, res, next) {
    renderLinksPage('Tools', 'tool', res);
});

function renderLinksPage(title, type, res) {
    var devLinks = require('../public/json/dev-links.json')
    var links = []
    for (link of devLinks) {
        if (link['type'] == type)
            links.push(link)
    }
    res.render('linksPage', {
        title: title,
        footerEvents: require('./events').getTrailerEvents(),
        links: links
    });
}

router.get('/brapps', function(req, res, next) {
    var brapps = require('../public/json/brapps.json');

    res.render('brapps', {
        title: 'BrAPPs',
        footerEvents: require('./events').getTrailerEvents(),
        brapps: brapps
    });
});

router.get('/contact', function(req, res, next) {
    res.render('contact', {
        title: 'Contact',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

router.get('/unsubscribe', function(req, res, next) {
    res.render('unsubscribe', {
        title: 'Unsubscribe',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

module.exports = router;