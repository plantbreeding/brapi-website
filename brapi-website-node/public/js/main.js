function toggleVisible(toggleId, btnId, displayTxt, hideTxt) {
    var toggleElm = document.getElementById(toggleId);
    var btnElm = document.getElementById(btnId);
    if (toggleElm.style.display === "block") {
        toggleElm.style.display = "none";
        btnElm.innerText = hideTxt;
    } else {
        toggleElm.style.display = "block";
        btnElm.innerText = displayTxt;
    }
}

(function() {

})(jQuery);