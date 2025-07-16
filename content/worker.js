'use strict';

/**
 * Set up an offscreen document to mimic (most) of what the background
 * page did.
 *
 * https://developer.chrome.com/docs/extensions/reference/api/offscreen
 */
async function setupOffscreenDocument() {
	let path = 'content/background.html';
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

/**
 * Partially working Action icon code
 * Replaces code in ui.js
 *
 * Supports inactive icon on non-ht pages.
 * Supports disabled icon when FT is disabled.
 * Does not change label when FT enabled/disabled.
 */


/**
 * Fetch an image and convert it to ImageData.
 *
 * Chrome won't accept `path` as a URL in SetIcon, so we have to use this.
 *
 * @param {string} url 
 * @return {Promise<ImageData>} ImageData
 */
async function loadImageData(url) {
	const response = await fetch(url);
	const blob = await response.blob();
	const image = await createImageBitmap(blob);
	const canvas = new OffscreenCanvas(image.width, image.height);
	const canvasContext = canvas.getContext('2d');
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);
	return canvasContext.getImageData(0, 0, canvas.width, canvas.height);
}

let activeIconUrl = chrome.runtime.getURL('/skin/active.png');

chrome.runtime.onInstalled.addListener(() => {
	chrome.action.disable();

	// Clear all rules to ensure only our expected rules are set
	chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
		loadImageData(activeIconUrl).then(icon => {
			let htUrlRule = {
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						pageUrl: { hostSuffix: '.hattrick.org' },
					})
				],
				actions: [new chrome.declarativeContent.ShowAction()],
			};

			let ftEnabledRule = {
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

			// Finally, apply our new array of rules
			let rules = [htUrlRule, ftEnabledRule];
			chrome.declarativeContent.onPageChanged.addRules(rules);
		});
	});
});

/**
 * Listeners for code that cannot be run in offscreen document context.
 */
chrome.runtime.onMessage.addListener(async (msg, sender, responseCallback) => {
	switch (msg.req) {
		case 'newTab':
			await setupOffscreenDocument();
			chrome.tabs.create({ url: msg.url });
			break;
		case 'notify':
			Foxtrick.util.notify.create(msg.msg, sender, msg);
			break;
	}
});

// @ts-ignore
let Foxtrick = { util: {} };

/**
 * Copied from /content/util/notify.js with some changes.
 *
 * A) Cannot use Foxtrick global object as it isn't fully initialised.
 * B) Webkit and Growl notification code removed
 * C) Content context code removed
 */

Foxtrick.util.notify = {};

/**
 * Create a desktop notification with a given message and link to source
 * Returns a promise that fulfills with the url once user acts on the notification
 * OR rejects with Foxtrick.TIMEOUT_ERROR if the notification is closed
 *
 * source is normally an URL or sender object in the background (non-Gecko).
 * opts is chrome NotificationOptions or
 * {msg, url, id: string, opts: NotificationOptions} in the background (non-Gecko).
 *
 * @param  {string}          msg
 * @param  {string|object}   source
 * @param  {object}          opts
 *
 * @return {Promise<string>}
 */
Foxtrick.util.notify.create = function (msg, source, opts) {
	const TITLE = 'Hattrick';
	const IMG = chrome.runtime.getURL('content/resources/img/icon-128.png'); // mv3 change type A
	// eslint-disable-next-line no-unused-vars
	const NAME = 'Foxtrick'; // lgtm[js/unused-local-variable]
	const IS_CLICKABLE = true;

	var gId = '', gUrl = '', gTabOpts = {}, gTabOptsBtn = {};

	var updateOriginTab = function (originTab, tabOpts) {
		var focusWindow = function (winId) {
			return new Promise(function (resolve) {
				chrome.windows.update(winId, { focused: true }, resolve);
			});
		};

		return new Promise(function (resolve) {
			if (!tabOpts)
				console.log(`Error: notify, tabOpts is ${tabOpts}`); // mv3 change type A

			if (tabOpts.url) {
				// open URLs in a new tab next to original
				// set correct position
				// not setting opener since originTab may already be closed
				let newOpts = Object.assign({
					windowId: originTab.windowId,
					index: originTab.index + 1,
				}, tabOpts);

				chrome.tabs.create(newOpts, resolve);
				return;
			}

			chrome.tabs.update(originTab.id, tabOpts, (tab) => {
				if (chrome.runtime.lastError) {
					// tab closed, restore
					let restoreOpts = Object.assign({
						url: gUrl,
						windowId: originTab.windowId,
						index: originTab.index,
					}, tabOpts);

					chrome.tabs.create(restoreOpts, resolve);
				}
				else {
					resolve(tab);
				}
			});
		}).then(function (tab) {
			return focusWindow(tab.windowId).then(function () {
				return tab;
			});
		});
	};

	var createChrome = async function () {
		var options = {
			type: 'basic',
			iconUrl: IMG,
			title: TITLE,
			message: msg,
			contextMessage: 'Click here to focus this tab', // mv3 change type A
			isClickable: IS_CLICKABLE,

			// buttons: [
			// 	{ title: 'Button1', iconUrl: 'resources/img/hattrick-logo.png' },
			// 	{ title: 'Button2', iconUrl: 'resources/img/hattrick-logo.png' }
			// ],
			// items: [
			// 	{ title: 'Item1', message: 'resources/img/hattrick-logo.png' },
			// 	{ title: 'Item2', message: 'resources/img/hattrick-logo.png' }
			// ],
		};
		if (opts) {
			// overwrite defaults
			for (var opt in opts)
				options[opt] = opts[opt];
		}

		var clearNote = function (noteId) {
			return new Promise(function (resolve) {
				chrome.notifications.clear(noteId, resolve);
			});
		};

		var createNote = function (gId, options) {
			return new Promise((fulfill, reject) => {
				chrome.notifications.create(gId, options, (nId) => {
					var err = chrome.runtime.lastError;
					if (err)
						reject(err);
					else
						fulfill(nId);
				});
			});
		};

		var getNotes = function () {
			return new Promise((fulfill) => {
				chrome.notifications.getAll(function (notes) {
					// eslint-disable-next-line no-empty
					if (chrome.runtime.lastError) { }

					fulfill(notes);
				});
			});
		};

		let notes = await getNotes();

		// clear dupes manually to trigger onClosed listener
		// prevents double execution when a note is duplicated before closing

		if (notes && gId in notes)
			await clearNote(gId);

		try {
			await createNote(gId, options);
		}
		catch (err) {
			// opera and FF do not support buttons
			// retrying without them
			if (!/buttons/.test(err.message))
				throw err;

			delete options.buttons;
			gTabOpts.url = gTabOptsBtn.url;

			await createNote(gId, options);
		}

		return new Promise((fulfill, reject) => {
			var unregister = () => { };

			var onClicked = async function onClicked(noteId) {
				if (noteId !== gId)
					return;

				try {
					unregister();
					await clearNote(noteId);
					await updateOriginTab(source.tab, gTabOpts);
					fulfill(gUrl);
				}
				catch (e) {
					reject(e);
				}
			};

			// eslint-disable-next-line no-unused-vars
			var onButtonClicked = async function onButtonClicked(noteId, btnIdx) {
				if (noteId !== gId)
					return;

				try {
					unregister();
					await clearNote(noteId);
					await updateOriginTab(source.tab, gTabOptsBtn);
					fulfill(gUrl);
				}
				catch (e) {
					reject(e);
				}
			};

			var onClosed = function onClosed(noteId) {
				if (noteId !== gId)
					return;

				unregister();

				reject(new Error('Foxtrick timeout')); // mv3 change type A
			};

			chrome.notifications.onClicked.addListener(onClicked);
			chrome.notifications.onButtonClicked.addListener(onButtonClicked);
			chrome.notifications.onClosed.addListener(onClosed);
			unregister = () => {
				chrome.notifications.onButtonClicked.removeListener(onButtonClicked);
				chrome.notifications.onClicked.removeListener(onClicked);
				chrome.notifications.onClosed.removeListener(onClosed);
			};
		});
	};

	// mv3 change type B

	// standardize options
	if (opts && opts.opts) {
		// request to background
		gId = opts.id || '';
		gUrl = opts.url;

		opts = opts.opts; // FIXME
	}
	else {
		// gecko or content
		opts = opts || {}; // FIXME

		if (opts.id) {
			gId = opts.id;
			delete opts.id;
		}

		gUrl = source;
	}

	gTabOpts = { active: true }; // focus only
	gTabOptsBtn = { active: true, url: gUrl }; // focus and open

	return createChrome(); // mv3 change type B
	// mv3 change type C
};
