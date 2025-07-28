/**
 * Partially working MV3 action icon code
 * Replaces code in ui.js
 *
 * Supports inactive icon on non-ht pages.
 * Supports disabled icon when FT is disabled.
 * Does not change label when FT enabled/disabled.
 */

'use strict';

const UI = {

    /**
     * Listener for chrome.runtime.onInstalled event.
     * Sets up MV3 action icon rules for the extension using declarativeContent API.
     * Loads the icon, then adds rules for showing the icon and setting it when FT is enabled.
     *
     * @function
     */
    actionListener: function () {

        /**
         * Fetch an image and convert it to ImageData.
         *
         * Chrome won't accept 'path' as a URL in SetIcon, so we have to use this.
         *
         * @param {string} url
         * @return {Promise<ImageData>} ImageData
         */
        const loadImageData = async function (url) {
            const response = await fetch(url);
            const blob = await response.blob();
            const image = await createImageBitmap(blob);
            const canvas = new OffscreenCanvas(image.width, image.height);
            const canvasContext = canvas.getContext('2d');
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);
            return canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        };

        const url = chrome.runtime.getURL('/skin/active.png');

        chrome.action.disable(); // Disable initially

        // Clear all rules to ensure only our expected rules are set
        chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
            loadImageData(url).then(icon => {

                // Show icon on ht pages
                const htUrlRule = {
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher({
                            pageUrl: { hostSuffix: '.hattrick.org' },
                        })
                    ],
                    actions: [new chrome.declarativeContent.ShowAction()],
                };

                // Set disabled icon when FT temporarily disabled
                const ftEnabledRule = {
                    // Initial implementation - simply check for presence of FT version
                    // number at the foot of the page.
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher({
                            css: ['#ft_versionInfo']
                        })
                    ],
                    actions: [
                        new chrome.declarativeContent.SetIcon({ imageData: { 16: icon } })
                    ]
                };

                const rules = [htUrlRule, ftEnabledRule];
                chrome.declarativeContent.onPageChanged.addRules(rules);
            });
        });
    }
};

export { UI };