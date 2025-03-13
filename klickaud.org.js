// ==UserScript==
// @name         Klickaud Popup Auto-Close & Conditional Container Hide
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Bezárja a popupot, és elrejti a container classú div-eket a klickaud.org oldalon, kivéve a download.php oldalon.
// @author       Gaohei
// @updateURL    https://raw.githubusercontent.com/GaoheiX/tampermonkey-scripts/refs/heads/main/klickaud.org.js
// @downloadURL  https://raw.githubusercontent.com/GaoheiX/tampermonkey-scripts/refs/heads/main/klickaud.org.js
// @match        *://*.klickaud.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Várakozás a popup bezáró gomb megjelenésére, majd rákattint
    function waitForButton() {
        var btn = document.querySelector('.fc-close.fc-icon-button');
        if (btn) {
            btn.click();
            console.log("A popup bezáró gombjára kattintottunk.");
        } else {
            setTimeout(waitForButton, 50);
        }
    }

    // Az összes "container" classú div elrejtése
    function hideContainers() {
        var containers = document.querySelectorAll('div.container');
        if (containers.length > 0) {
            containers.forEach(function(div) {
                div.style.display = 'none';
            });
            console.log("Container div-ek elrejtve.");
        } else {
            console.log("Nincsenek container classú div-ek a lapon.");
        }
    }

    // A DOM teljes betöltődése után futtatjuk a funkciókat
    window.addEventListener('load', function(){
         waitForButton();
         // Csak akkor rejtjük el a container div-eket, ha az oldal URL-je nem tartalmazza a "download.php"-t
         if (!window.location.href.includes("download.php")) {
             hideContainers();
         } else {
             console.log("A container div-ek nem kerülnek elrejtésre ezen az oldalon: download.php");
         }
    });
})();
