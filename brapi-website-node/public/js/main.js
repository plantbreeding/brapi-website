function setVisible(elemId, isVis) {
    var elem = document.getElementById(elemId);
    if (isVis) {
        elem.style.display = "block";
    } else {
        elem.style.display = "none";
    }
}

function toggleVisible(toggleId, btnId, displayTxt, hideTxt) {
    var toggleElm = document.getElementById(toggleId);
    setVisible(toggleId, (toggleElm.style.display === "none"));

    var btnElm = document.getElementById(btnId);
    if (toggleElm.style.display === "block")
        btnElm.innerHTML = "<span class=\"mdi mdi-chevron-double-up\"></span> " + displayTxt + " <span class=\"mdi mdi-chevron-double-up\"></span>";
    else
        btnElm.innerHTML = "<span class=\"mdi mdi-chevron-double-down\"></span> " + hideTxt + " <span class=\"mdi mdi-chevron-double-down\"></span>";
}

function toggleVisibleXor(visibleId, allIds, defaultIndex) {
    var i = allIds.indexOf(visibleId)
    if (i < 0) {
        i = defaultIndex;
    }
    var hideIds = JSON.parse(JSON.stringify(allIds));
    hideIds.splice(i, 1);

    setVisible(visibleId, true);
    for (const id of hideIds) {
        setVisible(id, false);
    }
}

$(document).ready(function() {
    if (window.location.pathname.startsWith("/events/hackathon")) {
        var page = window.location.hash.replace("#", "");
        if (page) {
            toggleVisibleXorHackathon(page);
        }
    }
});

function toggleVisibleXorHackathon(page) {
    toggleVisibleXor(page, ['overview-section', 'agenda-section', 'attendees-section', 'projects-section', 'notes-section'])

    window.location.hash = '#' + page;
}

(function() {

})(jQuery);