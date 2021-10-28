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
        btnElm.innerText = displayTxt;
    else
        btnElm.innerText = hideTxt;
}

function toggleVisibleXor(visibleId, invisibleIds) {
    setVisible(visibleId, true);
    window.location.hash = '#' + visibleId;
    for (const id of invisibleIds) {
        setVisible(id, false);
    }
    window.scrollTo(0, 0);
}

$(document).ready(function() {
    // console.log("document loaded");
    if (window.location.pathname === "/events/hackathon-oct-2021") {
        hackathonLoadPage();
    }
});

function hackathonLoadPage() {
    page = window.location.hash.replace("#", "");
    switch (page) {
        case 'agenda-section':
            toggleVisibleXor('agenda-section', ['overview-section', 'attendees-section', 'projects-section', 'notes-section']);
            break;
        case 'attendees-section':
            toggleVisibleXor('attendees-section', ['overview-section', 'agenda-section', 'projects-section', 'notes-section']);
            break;
        case 'projects-section':
            toggleVisibleXor('projects-section', ['overview-section', 'agenda-section', 'attendees-section', 'notes-section']);
            break;
        case 'notes-section':
            toggleVisibleXor('notes-section', ['overview-section', 'agenda-section', 'attendees-section', 'projects-section']);
            break;
        case 'overview-section':
        default:
            toggleVisibleXor('overview-section', ['agenda-section', 'attendees-section', 'projects-section', 'notes-section']);
    }

}


(function() {

})(jQuery);