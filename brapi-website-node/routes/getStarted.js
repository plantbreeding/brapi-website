var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var getStartedArr = require('../public/json/get-started-pages.json');
    renderGetStarted(0, getStartedArr, res);
});

router.get('/:pageNum', function (req, res, next) {
    var pageNum = parseInt(req.params.pageNum, 10);
    if(isNaN(pageNum)){
        next();
    }else{
        var getStartedArr = require('../public/json/get-started-pages.json');

        if (pageNum >= getStartedArr.length || pageNum < 0) {
            next();
        }else{
            renderGetStarted(pageNum, getStartedArr, res);
        }
    }
});

function renderGetStarted(pageNum, getStartedArr, res){
    var nextHref = '';
    var nextTitle = '';
    var SEOFAQ = '';
    if (pageNum + 1 < getStartedArr.length) {
        var nextHref = '/get-started/' + (pageNum + 1)
        var nextTitle = getStartedArr[pageNum + 1]['title']
    } else {
        var nextHref = '/specification'
        var nextTitle = 'BrAPI Specification'
        var SEOFAQ = buildFAQ();
    }

    var prevHref = ''
    var prevTitle = ''
    if (pageNum - 1 >= 0) {
        var prevHref = '/get-started/' + (pageNum - 1)
        var prevTitle = getStartedArr[pageNum - 1]['title']
    }

    res.render('getStarted', {
        title: 'Getting Started',
        footerEvents: require('./events').getTrailerEvents(),
        page: getStartedArr[pageNum],
        pages: getStartedArr,
        nextHref: nextHref,
        nextTitle: nextTitle,
        prevHref: prevHref,
        prevTitle: prevTitle,
        SEOTitle: 'Getting Started: ' + getStartedArr[pageNum]['title'],
        SEOFAQJSON: SEOFAQ
    });
}

function buildFAQ() {
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "What is BrAPI?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>BrAPI is a standardized RESTful web service API specification for communicating plant breeding data. The Breeding API (BrAPI) project is an effort to enable interoperability among plant breeding databases. This community driven standard is free to be used by anyone interested in plant breeding data management. <br/>Please read this page: <a href=\"/get-started/1\"> What is BrAPI?</a> If you still have questions, please contact the BrAPI Coordinator.</p>"
            }
        },{
            "@type": "Question",
            "name": "Do I need to implement ALL of BrAPI to be compliant?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>No. Only implement the BrAPI endpoints that make sense in your systems for your use cases. BrAPI v2.0 has 179 documented endpoints spread across a wide variety of data types. That is too many for every group in the BrAPI community to be expected to develop.</p>"
            }
        },{
            "@type": "Question",
            "name": "How can I test if my system is BrAPI compliant?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>The <a href=\"http://webapps.ipk-gatersleben.de/brapivalidator \"> BRAVA </a> testing tool is a community developed client application for testing BrAPI servers.</p>"
            }
        },{
            "@type": "Question",
            "name": "How do I report a problem or suggest an enhancement to the BrAPI documentation?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>Go to the <a href=\"https://github.com/plantbreeding/API\"> BrAPI Github </a> and create an issue. Issues are reviewed regularly, though changes might not be formally added until the next version of the specification. <br/>Do not let changes to the BrAPI specification slow down development! It can take a long time for changes to be accepted and added to the formal documentation. If you need a new field or parameter to solve your specific use case, add to your implementation, document the deviation from the standard, and keep building. The BrAPI standard will catch up to mirror existing implementations that work.</p>"
            }
        },{
            "@type": "Question",
            "name": "How do I join the BrAPI Community?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>Just by being interested in BrAPI and reading this, you have already taken the first step! The BrAPI Community is an international group of developers and scientists who are invested in the BrAPI project. By interacting and contributing to this group, you become a part of it. Here are some ways to get involved:<ul><li>Implement a BrAPI server or client application. </li><li>Contribute to a community BRAPP, tool, or code library.</li><li>Suggest an enhancement to the specification by creating an issue on <a href=\"https://github.com/plantbreeding/API\"> Github </a>. </li><li>Respond to an existing issue on <a href=\"https://github.com/plantbreeding/API\"> Github </a>.</li><li>Attend one of the BrAPI Community Hackathons held around the world. </li><li>Join the BrAPI Slack channel and talk directly to community members. </li><li>Join the BrAPI mailing list to receive community updates.</li></ul></p>"
            }
        },{
            "@type": "Question",
            "name": "How does my organization become a BrAPI partner?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p><a href=\"/partners\"> BrAPI Partners </a> are organizations who support the BrAPI project. There is no formal commitment to becoming a partner, just send the organization logo and website to the BrAPI Coordinator to be posted on the Partners page.</p>"
            }
        },{
            "@type": "Question",
            "name": "How is BrAPI funded?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>The BrAPI project is currently in the middle of a 4-year grant from the USDA NIFA, managed by Cornell University. This grant primarily funds the BrAPI Project Coordinator position, currently held by Peter Selby.</p>"
            }
        },{
            "@type": "Question",
            "name": "Will the BrAPI Project funding be sustainable long-term?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>Long-term sustainability is always a tricky question, but the BrAPI community is strong and still growing. The core of the project is just documentation, and the cost of maintaining that documentation is almost nothing. Enhancements to the specification, additional support tools, and community organization all require more time and resources, but these efforts might be spread across members in the community. With a strong, committed community, and very small maintenance cost, BrAPI will continue to exist as long as there are people using it.</p>"
            }
        }]
    })
}

module.exports = router;