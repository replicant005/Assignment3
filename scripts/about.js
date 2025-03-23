// author - mehak kapur
// date - 20th feb 2025
"use strict";

// Show or hide the "Back to Home" button
const backToHomeButton = document.getElementById("backToHome");

window.onscroll = () => {
    if (window.scrollY > 300) {
        backToHomeButton.style.display = "block";
    } else {
        backToHomeButton.style.display = "none";
    }
};