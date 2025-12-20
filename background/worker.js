'use strict';

// core
importScripts('globals.js');
importScripts('../content/env.js');
importScripts('../content/prefs-util.js');
importScripts('../content/l10n.js');
importScripts('../content/xml-load.js');
importScripts('../content/pages.js');
// ext-lib
importScripts('../content/lib/indexedDB.polyfill.js');
importScripts('../content/lib/idbstore.js');
importScripts('../content/lib/oauth.js');
importScripts('../content/lib/sha1.js');
importScripts('../content/lib/PluralForm.js');
importScripts('../content/lib/sentry.js');
// remap lib globals
importScripts('../content/lib/integration.js');
// util
importScripts('../content/util/api.js');
importScripts('../content/util/array.js');
importScripts('../content/util/async.js');
importScripts('../content/util/cookies.js');
importScripts('../content/util/load.js');
importScripts('../content/util/local-store.js');
importScripts('../content/util/log.js');
importScripts('../content/util/math.js');
importScripts('../content/util/misc.js');
importScripts('../content/util/module.js');
importScripts('../content/util/notify.js');
importScripts('../content/util/permissions.js');
importScripts('../content/util/session-store.js');
// core
importScripts('../content/core.js');
importScripts('../content/ui.js');
// categorized modules
importScripts('../content/shortcuts-and-tweaks/context-menu-copy.js');
// entry point
importScripts('../content/entry.js');
importScripts('../content/background.js');

const startHandler = () => {
    // always disable these at start/restart
	Foxtrick.Prefs.setBool('featureHighlight', false);
	Foxtrick.Prefs.setBool('translationKeys', false);
};

chrome.runtime.onStartup.addListener(startHandler);
chrome.runtime.onInstalled.addListener(startHandler);