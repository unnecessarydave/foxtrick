/**
 * chromeversion.js
 * Display a Foxtrick Note when a new chrome version is available.
 * Temporary module while chrome users are installing in developer mode.
 * @author UnnecessaryDave
 */

'use strict';

Foxtrick.modules['NotifyChromeVersion'] = {
    MODULE_CATEGORY: Foxtrick.moduleCategories.ALERT,
    PAGES: ['dashboard'],

    // extension GUID - release branch
    GUID: '{bcfe9090-dfc6-41d6-a49c-127432ec04ea}',

    // yes, we use the firefox update.json to find the latest release version number
    // - chrome and firefox version numbers are in sync
    UPDATE_JSON_URL: 'https://foxtrick-ng.github.io/download/release/firefox/update.json',

    // url to page with chrome update instructions
    CHROME_UPDATE_URL: 'https://foxtrick-ng.github.io/chromeupgrade.html',

    // cache fetched update.json for 24 hours
    CACHE_UNTIL: Date.now() + (24 * 60 * 60 * 1000),

    run: async function(doc) {
        /** @ts-ignore */
        if (!navigator.userAgentData) // only defined in chromium browsers
            return;

        if (await Foxtrick.session.get('seenUpdateNote'))  // show note once per session
            return;

        const MODULE = this;
        const log = this.log.bind(this);

        let jsonText;
        log("Loading " + MODULE.UPDATE_JSON_URL);
        try {
            jsonText =  await Foxtrick.load(MODULE.UPDATE_JSON_URL, undefined, MODULE.CACHE_UNTIL);
        } catch (e) {
            log("Failed to load " + MODULE.UPDATE_JSON_URL);
            return;
        }

        let updates;
        try {
            //@ts-ignore - if jsonText is not a string FetchError will be caught in try/catch above
            let json = JSON.parse(jsonText);
            updates = json.addons[MODULE.GUID].updates;
            if (!updates)
                throw new TypeError();
        } catch (e) {
            if (e.name == 'TypeError') {
                log("addons."+ MODULE.GUID + ".updates not found in json");
            } else {
                log("caught " + e.name + "when parsing json");
            }
            return;
        }

        // use localecompare (alphabetical ordering) to compare version numbers
        let latestVersion = '0';
        for (let versionObj of updates) {
            if (versionObj.version && versionObj.version.localeCompare(latestVersion) > 0)
                latestVersion = versionObj.version;
        }

        if (Foxtrick.version.localeCompare(latestVersion) < 0 ) {
            //FIXME: internationalise once we can add new l10n keys

            let container = doc.createElement('div');
            let p = doc.createElement('p');
            container.appendChild(p);

            let a = doc.createElement('a');
            a.href = MODULE.CHROME_UPDATE_URL;
            a.textContent = 'here';
            a.target = '_blank';

            p.innerHTML =
                "A new version of Foxtrick is available: " + latestVersion
                + doc.createElement('br').outerHTML
                + " - Click " + a.outerHTML + " for update instructions.";

            Foxtrick.util.note.add(doc, container, 'ft-notify-chrome-version',);
            Foxtrick.session.set('seenUpdateNote', 'true');
        }
    },

    log: function(text) {
        Foxtrick.log(this.MODULE_NAME+ ": " + text);
    }
};
