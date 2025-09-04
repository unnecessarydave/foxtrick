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
importScripts('../content/lib/yaml.js');
importScripts('../content/lib/psico.js');
importScripts('../content/lib/gauge.js');
importScripts('../content/lib/sentry.js');
// remap lib globals
importScripts('../content/lib/integration.js');
// util
importScripts('../content/util/api.js');
importScripts('../content/util/array.js');
importScripts('../content/util/async.js');
importScripts('../content/util/color.js');
importScripts('../content/util/cookies.js');
importScripts('../content/util/copy-button.js');
importScripts('../content/util/css.js');
importScripts('../content/util/currency.js');
importScripts('../content/util/dom.js');
importScripts('../content/util/ht-ml.js');
importScripts('../content/util/id.js');
importScripts('../content/util/links-box.js');
importScripts('../content/util/load.js');
importScripts('../content/util/local-store.js');
importScripts('../content/util/log.js');
importScripts('../content/util/match-event.js');
importScripts('../content/util/match-view.js');
importScripts('../content/util/math.js');
importScripts('../content/util/misc.js');
importScripts('../content/util/module.js');
importScripts('../content/util/note.js');
// importScripts('../content/util/notify.js');
importScripts('../content/util/permissions.js');
importScripts('../content/util/sanitize.js');
importScripts('../content/util/session-store.js');
importScripts('../content/util/string.js');
importScripts('../content/util/tabs.js');
importScripts('../content/util/time.js');
// core
importScripts('../content/add-class.js');
importScripts('../content/core.js');
importScripts('../content/fix-links.js');
importScripts('../content/forum-stage.js');
importScripts('../content/read-ht-prefs.js');
importScripts('../content/redirections.js');
importScripts('../content/ui.js');
// categorized modules
importScripts('../content/access/aria-landmarks.js');
importScripts('../content/alert/chrome-version.js');
importScripts('../content/alert/live-alert.js');
importScripts('../content/alert/new-mail.js');
importScripts('../content/alert/ticker-alert.js');
importScripts('../content/alert/ticker-coloring.js');
importScripts('../content/forum/auto-post-specs.js');
importScripts('../content/forum/embed-media.js');
importScripts('../content/forum/forum-change-posts-modules.js');
importScripts('../content/forum/forum-change-posts.js');
importScripts('../content/forum/forum-direct-page-links.js');
importScripts('../content/forum/forum-last-post.js');
importScripts('../content/forum/forum-leave-button.js');
importScripts('../content/forum/forum-mod-popup.js');
importScripts('../content/forum/forum-next-and-previous.js');
importScripts('../content/forum/forum-presentation.js');
importScripts('../content/forum/forum-preview.js');
importScripts('../content/forum/forum-strip-hattrick-links.js');
importScripts('../content/forum/forum-templates.js');
importScripts('../content/forum/forum-thread-auto-ignore.js');
importScripts('../content/forum/forum-youth-icons.js');
importScripts('../content/forum/go-to-post-box.js');
importScripts('../content/forum/hide-signatures.js');
importScripts('../content/forum/ht-thread-marker.js');
importScripts('../content/forum/mark-all-as-read.js');
importScripts('../content/forum/show-forum-pref-button.js');
importScripts('../content/forum/staff-marker.js');
importScripts('../content/information-aggregation/cross-table.js');
importScripts('../content/information-aggregation/current-transfers.js');
importScripts('../content/information-aggregation/dashboard-calendar.js');
importScripts('../content/information-aggregation/election-table.js');
importScripts('../content/information-aggregation/extended-player-details.js');
importScripts('../content/information-aggregation/extra-player-info.js');
importScripts('../content/information-aggregation/flag-collection-to-map.js');
importScripts('../content/information-aggregation/history-stats.js');
importScripts('../content/information-aggregation/htms-points.js');
importScripts('../content/information-aggregation/last-login.js');
importScripts('../content/information-aggregation/match-weather.js');
importScripts('../content/information-aggregation/mercattrick-stats.js');
importScripts('../content/information-aggregation/my-monitor.js');
importScripts('../content/information-aggregation/nt-peek.js');
importScripts('../content/information-aggregation/player-birthday.js');
importScripts('../content/information-aggregation/player-positions-evaluations.js');
importScripts('../content/information-aggregation/player-stats-experience.js');
importScripts('../content/information-aggregation/psico-tsi.js');
importScripts('../content/information-aggregation/season-stats.js');
importScripts('../content/information-aggregation/series-flags.js');
importScripts('../content/information-aggregation/series-transfers.js');
importScripts('../content/information-aggregation/show-friendly-booked.js');
importScripts('../content/information-aggregation/show-lineup-set.js');
importScripts('../content/information-aggregation/skill-table.js');
importScripts('../content/information-aggregation/specialty-info.js');
importScripts('../content/information-aggregation/supporterstats-enhancements.js');
importScripts('../content/information-aggregation/table-of-statistical-truth.js');
importScripts('../content/information-aggregation/team-stats.js');
importScripts('../content/information-aggregation/transfer-compare-players.js');
importScripts('../content/information-aggregation/transfer-deadline.js');
importScripts('../content/information-aggregation/u21-lastmatch.js');
importScripts('../content/information-aggregation/youth-promotes.js');
importScripts('../content/information-aggregation/youth-series-estimation.js');
importScripts('../content/information-aggregation/youth-skills.js');
importScripts('../content/links/links-achievements.js');
importScripts('../content/links/links-alliances.js');
importScripts('../content/links/links-arena.js');
importScripts('../content/links/links-challenges.js');
importScripts('../content/links/links-club-transfers.js');
importScripts('../content/links/links-coach.js');
importScripts('../content/links/links-country.js');
importScripts('../content/links/links-economy.js');
importScripts('../content/links/links-fans.js');
importScripts('../content/links/links-flags.js');
importScripts('../content/links/links-league.js');
importScripts('../content/links/links-manager.js');
importScripts('../content/links/links-match.js');
importScripts('../content/links/links-national.js');
importScripts('../content/links/links-player-detail.js');
importScripts('../content/links/links-players.js');
importScripts('../content/links/links-team.js');
importScripts('../content/links/links-tracker.js');
importScripts('../content/links/links-training.js');
importScripts('../content/links/links-world.js');
importScripts('../content/links/links-youth.js');
importScripts('../content/links/links.js');
importScripts('../content/matches/att-vs-def.js');
importScripts('../content/matches/copy-ratings.js');
importScripts('../content/matches/htms-prediction.js');
importScripts('../content/matches/live-match-report-format.js');
importScripts('../content/matches/match-income.js');
importScripts('../content/matches/match-lineup-fixes.js');
importScripts('../content/matches/match-lineup-tweaks.js');
importScripts('../content/matches/match-order-new.js');
importScripts('../content/matches/match-order.js');
importScripts('../content/matches/match-player-colouring.js');
importScripts('../content/matches/match-ratings-tweaks.js');
importScripts('../content/matches/match-report-format.js');
importScripts('../content/matches/match-simulator.js');
importScripts('../content/matches/ratings.js');
importScripts('../content/presentation/bookmark-adjust.js');
importScripts('../content/presentation/country-list.js');
// importScripts('../content/presentation/currency-converter.js');
importScripts('../content/presentation/custom-medals.js');
importScripts('../content/presentation/fans.js');
importScripts('../content/presentation/fix-css-problems.js');
importScripts('../content/presentation/friendly-interface.js');
importScripts('../content/presentation/friendly-pool.js');
importScripts('../content/presentation/header-toggle.js');
importScripts('../content/presentation/highlight-cup-wins.js');
importScripts('../content/presentation/highlight-ownerless.js');
importScripts('../content/presentation/ht-date-format.js');
importScripts('../content/presentation/large-flags.js');
importScripts('../content/presentation/league-news-filter.js');
importScripts('../content/presentation/local-time.js');
importScripts('../content/presentation/loyalty-display.js');
// importScripts('../content/presentation/mobile-enhancements.js');
importScripts('../content/presentation/move-manager-online.js');
importScripts('../content/presentation/move-player-select-box.js');
importScripts('../content/presentation/move-player-statement.js');
importScripts('../content/presentation/old-style-face.js');
importScripts('../content/presentation/original-face.js');
importScripts('../content/presentation/personality-images.js');
importScripts('../content/presentation/ratings-display.js');
importScripts('../content/presentation/safe-for-work.js');
importScripts('../content/presentation/simple-presentation.js');
importScripts('../content/presentation/skill-coloring.js');
importScripts('../content/presentation/skill-translation.js');
importScripts('../content/presentation/skin-plugin.js');
importScripts('../content/presentation/supporters-list.js');
// importScripts('../content/presentation/tabs-test.js');
importScripts('../content/presentation/team-select-box.js');
importScripts('../content/presentation/youth-skill-hide-unknown.js');
importScripts('../content/shortcuts-and-tweaks/add-promotion-reminder.js');
importScripts('../content/shortcuts-and-tweaks/confirm-actions.js');
importScripts('../content/shortcuts-and-tweaks/context-menu-copy.js');
importScripts('../content/shortcuts-and-tweaks/copy-bb-ad.js');
importScripts('../content/shortcuts-and-tweaks/copy-match-id.js');
importScripts('../content/shortcuts-and-tweaks/copy-player-ad.js');
importScripts('../content/shortcuts-and-tweaks/copy-youth.js');
importScripts('../content/shortcuts-and-tweaks/extra-shortcuts.js');
importScripts('../content/shortcuts-and-tweaks/filter.js');
importScripts('../content/shortcuts-and-tweaks/lineup-shortcut.js');
importScripts('../content/shortcuts-and-tweaks/manager-buttons.js');
importScripts('../content/shortcuts-and-tweaks/player-filters.js');
importScripts('../content/shortcuts-and-tweaks/rapid-id.js');
importScripts('../content/shortcuts-and-tweaks/relive-links.js');
importScripts('../content/shortcuts-and-tweaks/senior-team-shortcuts.js');
importScripts('../content/shortcuts-and-tweaks/supportership-expiration-date.js');
importScripts('../content/shortcuts-and-tweaks/table-sort.js');
importScripts('../content/shortcuts-and-tweaks/team-popup-links.js');
importScripts('../content/shortcuts-and-tweaks/transfer-search-filters.js');
importScripts('../content/shortcuts-and-tweaks/transfer-search-result-filters.js');

importScripts('../content/entry.js');
importScripts('../content/background.js');


// import {Notify} from './util/notify.js';
// import {UI} from './ui.js';
// import { Foxtrick as Cookies} from './util/cookies.js';
// import {ContextMenuCopy} from './shortcuts-and-tweaks/context-menu-copy.js';

'use strict';

/**
 * Set up an offscreen document to mimic (most) of what the background
 * page did.
 *
 * https://developer.chrome.com/docs/extensions/reference/api/offscreen
 */
// async function setupOffscreenDocument() {
// 	const path = 'content/background.html?_offscreen=1';
// 	// Check all windows controlled by the service worker to see if one
// 	// of them is the offscreen document with the given path
// 	const offscreenUrl = chrome.runtime.getURL(path);
// 	const existingContexts = await chrome.runtime.getContexts({
// 		contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
// 		documentUrls: [offscreenUrl]
// 	});

// 	if (existingContexts.length > 0) {
// 		return;
// 	}

// 	// create offscreen document
// 	if (offscreenPromise) {
// 		await offscreenPromise;
// 	} else {
// 		offscreenPromise = chrome.offscreen.createDocument({
// 			url: path,
// 			reasons: [chrome.offscreen.Reason.DOM_PARSER],
// 			justification: 'testing',
// 		});
// 		await offscreenPromise;
// 		offscreenPromise = null;
// 	}
// }

// let offscreenPromise; // A global promise to avoid concurrency issues
// setupOffscreenDocument();

// // Update action icon.
// chrome.runtime.onInstalled.addListener(UI.actionListener.bind(UI));

// // Listeners for code that cannot be run in offscreen document context.
// chrome.runtime.onMessage.addListener((msg, sender, responseCallback) => {
// 	switch (msg.req) {
// 		case 'cookiesGet':
// 			Cookies.cookies.get(msg.key, msg.name) // never rejects
// 				.then(responseCallback);
// 			return true;

// 		case 'cookiesSet':
// 			Cookies.cookies.set(msg.key, msg.value, msg.name) // never rejects
// 				.then(responseCallback);
// 			return true;

// 		case 'updateContextMenu':
// 			ContextMenuCopy.handler(msg);
// 			return true;

// 		case 'newTab':
// 			chrome.tabs.create({ url: msg.url })
// 				.then(responseCallback);
// 			return true;

// 		case 'notify':
// 			Notify.create(msg.msg, sender, msg)
// 				.then(responseCallback);
// 			return true;
// 	}
// 	return false;
// });
