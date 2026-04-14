// ==UserScript==
// @name         Suno Auto MP3 Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Auto MP3 download with filename for Suno.ai
// @match        *://*.suno.ai/*
// @match        *://*.suno.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function sanitizeFilename(name) {
        return name.replace(/[\\/:*?"<>|]/g, '').trim();
    }

    function parseTitle() {
        const title = document.title; // pl: City Groove After Dark by Gaohei | Suno
        const match = title.match(/(.+?) by (.+?) \|/);

        if (match) {
            return {
                song: match[1].trim(),
                artist: match[2].trim()
            };
        }

        return {
            song: "unknown",
            artist: "unknown"
        };
    }

    async function downloadMP3(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            URL.revokeObjectURL(link.href);
            link.remove();
        } catch (err) {
            console.error("Download error:", err);
        }
    }

    function createDownloadButton(downloadURL, songId) {
        let button = document.createElement('button');
        button.innerText = 'MP3';

        button.onclick = function() {
            const { song, artist } = parseTitle();

            const filename = sanitizeFilename(
                `${artist} - ${song} - ${songId}.mp3`
            );

            downloadMP3(downloadURL, filename);
        };

        button.style.marginLeft = '5px';
        button.style.fontSize = '12px';
        button.style.padding = '5px 10px';
        button.style.whiteSpace = 'nowrap';
        button.style.display = 'inline-block';
        button.style.backgroundColor = '#f9f7f5';
        button.style.color = '#0d0808';

        return button;
    }

    function addDownloadButtons() {
        const regexPattern = /https:\/\/suno\.com\/song\/([a-zA-Z0-9-]+)/;
        const buttons = document.querySelectorAll('div.flex.flex-row.items-center.justify-end.gap-2');

        buttons.forEach(function(button) {
            let parentDiv = button.parentElement;

            if (!parentDiv.dataset.downloadsAdded) {
                let match = regexPattern.exec(window.location.href);

                if (match && match[1]) {
                    let songId = match[1];
                    let mp3DownloadURL = `https://cdn1.suno.ai/${songId}.mp3`;

                    let mp3Button = createDownloadButton(mp3DownloadURL, songId);

                    parentDiv.insertAdjacentElement('beforebegin', mp3Button);
                    parentDiv.dataset.downloadsAdded = true;
                }
            }
        });
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                addDownloadButtons();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    addDownloadButtons();
})();