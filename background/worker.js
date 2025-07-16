import {Notify} from './util/notify.js';
import {UI} from './ui.js';

'use strict';

/**
 * Set up an offscreen document to mimic (most) of what the background
 * page did.
 *
 * https://developer.chrome.com/docs/extensions/reference/api/offscreen
 */
async function setupOffscreenDocument() {
	const path = 'content/background.html';
	// Check all windows controlled by the service worker to see if one
	// of them is the offscreen document with the given path
	const offscreenUrl = chrome.runtime.getURL(path);
	const existingContexts = await chrome.runtime.getContexts({
		contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
		documentUrls: [offscreenUrl]
	});

	if (existingContexts.length > 0) {
		return;
	}

	// create offscreen document
	if (offscreenPromise) {
		await offscreenPromise;
	} else {
		offscreenPromise = chrome.offscreen.createDocument({
			url: path,
			reasons: [chrome.offscreen.Reason.DOM_PARSER],
			justification: 'testing',
		});
		await offscreenPromise;
		offscreenPromise = null;
	}
}

let offscreenPromise; // A global promise to avoid concurrency issues
setupOffscreenDocument();

// Update action icon.
chrome.runtime.onInstalled.addListener(UI.actionListener.bind(UI));

// Listeners for code that cannot be run in offscreen document context.
chrome.runtime.onMessage.addListener(async (msg, sender, responseCallback) => {
	switch (msg.req) {
		case 'newTab':
			await setupOffscreenDocument();
			chrome.tabs.create({ url: msg.url });
			break;
		case 'notify':
			Notify.create(msg.msg, sender, msg);
			break;
	}
});
