var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'BrAPI',
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
        partners: partners
    });
});

router.get('/events', function(req, res, next) {
    var events = require('../public/json/events.json')
    var currentEvents = []
    var pastEvents = []
    for (event of events) {
        if (event['upcoming']) {
            currentEvents.push(event)
        } else {
            pastEvents.push(event)
        }
    }

    res.render('events', {
        title: 'Events',
        currentEvents: currentEvents,
        pastEvents: pastEvents
    });
});

router.get('/specification', function(req, res, next) {
    res.render('specification', {
        title: 'BrAPI Specification'
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
        links: links
    });
}

router.get('/brapps', function(req, res, next) {
    var brapps = require('../public/json/brapps.json')

    res.render('brapps', {
        title: 'BrAPPs',
        brapps: brapps
    });
});

module.exports = router;