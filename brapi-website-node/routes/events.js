var express = require('express');
const { google, outlook, office365, yahoo, ics } = require("calendar-link");
var router = express.Router();

router.get('/', function (req, res, next) {
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


router.get('/hackathon', function (req, res, next) {
    var hackathonData = require('../public/json/hackathons.json');

    var id = req.query.id;
    if(id){
        renderHackathonPage(hackathonData, id, res);
    }else{
        renderHackathonPage(hackathonData, Object.keys(hackathonData)[0], res);
    }
});

var renderHackathonPage = function (hackathonData, eventID, res) {
    if (hackathonData[eventID]) {
        var attendees = hackathonData[eventID].attendees;
        attendees.sort(function (a, b) {
            var result = a.org > b.org ? 1 : ((b.org > a.org) ? -1 : 0);
            if (result === 0)
                var result = a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0);
            return result;
        });
        var session1List = [],
            session2List = [];
        attendees.forEach(attendee => {
            if (attendee.session1)
                session1List.push(attendee);
            if (attendee.session2)
                session2List.push(attendee);
        });
        hackathonData[eventID]["session1List"] = session1List;
        hackathonData[eventID]["session2List"] = session2List;

        if (hackathonData[eventID]["calendarInvite"]) {
            var calendarLinks = buildCalendarLinks(hackathonData[eventID].calendarInvite);
        }
        res.render('hackathons/' + eventID, {
            title: 'BrAPI Hackathon',
            footerEvents: getTrailerEvents(),
            hackathonData: hackathonData[eventID],
            calendarLinks: calendarLinks,
            twitterTitle: 'BrAPI Hackathon',
            twitterDesc: eventID,
            SEOEventJSON: buildEventSchema(hackathonData[eventID])
        });
    }else{
        res.redirect("/events");
    }
}

var buildEventSchema = function (data) {
    var schema = {};
    if (data.calendarInvite) {
        schema = {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "BrAPI Hackathon",
            "description": data.calendarInvite.description,
            "startDate": data.calendarInvite.start,
            "endDate": data.calendarInvite.end,
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "location": {
                "@type": "VirtualLocation",
                "url": "https://brapi.org/events/hackathon"
            },
            "image": [
                "https://brapi.org/images/events/home_office_generated_8.png",
                "https://brapi.org/images/brapi-clover-alpha-700x394.png"
            ],
            "organizer": {
                "@type": "Organization",
                "name": "BrAPI Community",
                "url": "https://brapi.org"
            },
            "offers": {
                "@type": "Offer",
                "url": "https://brapi.org/events/hackathon",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "validFrom": data.calendarInvite.start
              },
              "performer": {
                "@type": "PerformingGroup",
                "name": "The BrAPI Community"
            }
        }
    }
    var schemaStr = JSON.stringify(schema)
    return schemaStr;
}

var getTrailerEvents = function () {
    var events = require('../public/json/events.json')
    var eventsOut = { "event1": null, "event2": null }
    for (ev of events) {
        if (ev['upcoming']) {
            if (ev.links) {
                ev.primary_link = ev['links'][0]['url'];
            } else {
                ev.primary_link = '/events'
            }

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

var buildCalendarLinks = function (event) {
    return {
        google: google(event),
        outlook: outlook(event),
        office365: office365(event),
        yahoo: yahoo(event),
        ics: ics(event)
    };
}

module.exports = {
    router: router,
    getTrailerEvents: getTrailerEvents
};