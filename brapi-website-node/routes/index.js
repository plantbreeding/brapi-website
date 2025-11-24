var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'BrAPI',
        footerEvents: require('./events').getTrailerEvents(),
        isHomePage: true,
        SEOWebsiteJSON: JSON.stringify(
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "BrAPI",
                "alternateName": ["The BrAPI Project", "Breeding API"],
                "url": "https://www.example.com/"
            }
        ),
        SEOOrganizationJSON: JSON.stringify(
            {
                "@context": "https://schema.org",
                "@type": "Organization",
                "url": "https://brapi.org",
                "logo": "https://brapi.org/images/brapi-logo.svg"
            })
    });
});

router.get('/partners', function (req, res, next) {
    var partners = require('../public/json/partners.json');
    partners.sort(function (a, b) {
        return a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0);
    });
    res.render('partners', {
        title: 'Partners',
        footerEvents: require('./events').getTrailerEvents(),
        partners: partners
    });
});

router.get('/specification', function (req, res, next) {
    var versions = require('../public/json/brapi-versions.json');
    res.render('specification', {
        title: 'BrAPI Specification',
        footerEvents: require('./events').getTrailerEvents(),
        v1: versions.v1,
        v2: versions.v2
    });
});

router.get('/documentation', function (req, res, next) {
    renderLinksPage('Documentation', 'doc', res);
});

router.get('/libraries', function (req, res, next) {
    renderLinksPage('Libraries', 'lib', res);
});

router.get('/tools', function (req, res, next) {
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

router.get('/brapps.php', function (req, res, next) { res.redirect('/brapps') });

router.get('/brapps', function (req, res, next) {
    var brapps = require('../public/json/brapps.json');

    res.render('brapps', {
        title: 'BrAPPs',
        footerEvents: require('./events').getTrailerEvents(),
        brapps: brapps
    });
});

router.get('/compatibleSoftware', function (req, res, next) {
    var softwareList = require('../public/json/compatibleSoftware.json');
    var badges = require('../public/json/badges.json')['software-badges'];
    const regThe = /^[tT]he /
    for (software of softwareList) {
        software.teamSortableName = software.team.replace(regThe, '');
        var badgesMap = {};
        if (software.badges) {
            for (badgeKey of software.badges) {
                badgesMap[badgeKey] = badges[badgeKey];
            }
        }
        software.badgeDetails = badgesMap;
    }

    res.render('compatibleSoftware', {
        title: 'Compatible Software',
        footerEvents: require('./events').getTrailerEvents(),
        software: softwareList,
        allBadges: badges,
        allBadgesStr: JSON.stringify(badges)
    });
});

router.get('/submitSoftware', function (req, res, next) {
    res.render('submitSoftware', {
        title: 'Register Software',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

router.get('/contact', function (req, res, next) {
    res.render('contact', {
        title: 'Contact',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

router.get('/unsubscribe', function (req, res, next) {
    res.render('unsubscribe', {
        title: 'Unsubscribe',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

router.get('/projectLeadership', function (req, res, next) {
    var projectLeadership = require('../public/json/project-leadership.json');

    res.render('projectLeadership', {
        title: 'Project Governance',
        footerEvents: require('./events').getTrailerEvents(),
        management: projectLeadership.projectManagement,
        board: projectLeadership.advisoryBoard
    });
});

router.get('/brapiAdvisoryBoard', function (req, res, next) {
    res.render('advisoryBoard', {
        title: 'Advisory Board',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

router.get('/advisoryBoardCandidates', function (req, res, next) {
    var json = require('../public/json/advisory-board-candidates.json');
    var candidates = json.candidates;

    let i = candidates.length;
    while (i--) {
        const ri = Math.floor(Math.random() * i);
        [candidates[i], candidates[ri]] = [candidates[ri], candidates[i]];
    }

    res.render('advisoryBoardCandidates', {
        pollsOpen: true,
        candidates: candidates,
        title: 'Advisory Board Candidates',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

router.get('/sabbaticals', function (req, res, next) {
    res.render('sabbaticals', {
        title: 'BrAPI Sabbatical Program',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

router.get('/branding', function (req, res, next) {
    res.render('branding', {
        title: 'BrAPI Branding',
        footerEvents: require('./events').getTrailerEvents(),
    });
});

module.exports = router;