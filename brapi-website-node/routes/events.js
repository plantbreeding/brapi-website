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

    res.render('events', {
        title: 'Events',
        footerEvents: getTrailerEvents(),
        currentEvents: currentEvents,
        pastEvents: pastEvents
    });
});


router.get('/:id', function(req, res, next) {
    res.render('hackathons/' + req.params.id, {
        title: 'BrAPI Virtual Hackathon',
        footerEvents: getTrailerEvents()
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