var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var events = require('../public/json/events.json')
    var currentEvents = []
    var pastEvents = []
    for (ev of events) {
        if (ev['upcoming']) {
            currentEvents.push(ev)
        } else {
            pastEvents.push(ev)
        }
    }

    var twitterEvent = { "title": "BrAPI Events", "description": "", "image": "" };
    if (currentEvents.length > 0) {
        twitterEvent.title = currentEvents[0].title + ', ' + currentEvents[0].date;
        twitterEvent.description = currentEvents[0].description,
            twitterEvent.image = currentEvents[0].image
    }

    res.render('events', {
        title: 'Events',
        footerEvents: getTrailerEvents(),
        currentEvents: currentEvents,
        pastEvents: pastEvents,
        twitterTitle: twitterEvent.title,
        twitterDesc: twitterEvent.description,
        twitterImg: twitterEvent.image
    });
});


router.get('/:id', function(req, res, next) {
    var hackathonData = require('../public/json/hackathons.json')
    res.render('hackathons/' + req.params.id, {
        title: 'BrAPI Virtual Hackathon',
        footerEvents: getTrailerEvents(),
        hackathonData: hackathonData[req.params.id],
        twitterTitle: 'BrAPI Virtual Hackathon',
        twitterDesc: req.params.id
    });
});

var getTrailerEvents = function() {
    var events = require('../public/json/events.json')
    var eventsOut = { "event1": null, "event2": null }
    for (ev of events) {
        if (ev['upcoming']) {
            ev.primary_link = ev['links'][0]['url'];
            if (eventsOut["event1"] == null) {
                eventsOut["event1"] = ev;
            } else if (eventsOut["event2"] == null) {
                eventsOut["event2"] = ev;
            } else {
                break;
            }
        }
    }
    return eventsOut;
}

module.exports = {
    router: router,
    getTrailerEvents: getTrailerEvents
};