/**
 * session-store.js
 *
 * session.set() and session.get() are a pair of functions that can store some
 * useful information that has its life spanning the browser session.
 *
 * The stored value must be a JSON-serializable object, or of native types.
 *
 * @author ryanli, convincedd, LA-MJ
 */

'use strict';

/* eslint-disable */
if (!this.Foxtrick)
	// @ts-ignore
	var Foxtrick = {};
/* eslint-enable */

Foxtrick.session = {};

// In MV3 service workers in-memory state is ephemeral. Prefer the
// extension-provided session storage area when available and fall back
// to an in-memory object for older platforms or MV2.
if (Foxtrick.context === 'background') {
	Foxtrick.session.__STORE = {};

	Foxtrick.session._getSessionApi = function() {
		if (Foxtrick.Manifest.manifest_version == 2)
			return null;

		try {
			if (typeof browser !== 'undefined' && browser.storage && browser.storage.session)
				return browser.storage.session;
			if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session)
				return chrome.storage.session;
		} catch { /* ignore */ }
		return null;
	};
}

/**
 * Get a promise when session value is set.
 *
 * key should be a string.
 * value may be any stringify-able object.
 *
 * @param  {string}          key
 * @param  {object}          value
 * @returns {Promise<string>}       {Promise.<key>}
 */
Foxtrick.session.set = function(key, value) {

	if (Foxtrick.context == 'content') {
		return new Promise((fulfill, reject) => {
			Foxtrick.SB.ext.sendRequest({
				req: 'sessionSet',
				key: key,
				value: value,
			}, function onSendResponse(response) {

				var err = Foxtrick.jsonError(response);
				if (err instanceof Error)
					reject(err);
				else
					fulfill(response);

			});
		});
	}

	// background/service-worker: prefer storage.session when available
	var api = Foxtrick.session._getSessionApi();
	if (api) {
		var obj = {};
		obj[key] = value;
		return api.set(obj).then(() => { return key; }).catch(err => {
			// If quota exceeded, clear and retry
			if (err.name === 'QuotaExceededError' || err.message.toLowerCase().includes('quota')) {
				Foxtrick.log('Foxtrick.session.set: browser storage quota exceeded.  Clear storage and retry.');
				return api.clear().then(() => {
					return api.set(obj).then(() => { return key; });
				});
			}
			throw err;
		});
	}

	return new Promise(resolve => {
		Foxtrick.session.__STORE[key] = value;
		resolve(key);
	});

};

/**
 * Get a promise for a session value.
 *
 * Promise will never reject, returns null instead.
 *
 * key should be a string.
 * value may be any stringify-able object or null if N/A.
 *
 * @param  {string}     key
 * @returns {Promise<?>}     {Promise.<?value>}
 */
Foxtrick.session.get = function(key) {
	if (Foxtrick.context == 'content') {
		return new Promise(fulfill => {
			// background never rejects
			Foxtrick.SB.ext.sendRequest({ req: 'sessionGet', key: key }, fulfill);
		});
	}

	// background/service-worker: prefer storage.session when available
	var api = Foxtrick.session._getSessionApi();
	if (api) {
		return api.get(key).then(items => {
			try {
				// If caller asked for all keys (key == null) return the whole
				// mapping as provided by the storage API (may be an object
				// mapping keys to values) or null.
				if (key == null)
					return items || null;

				// Otherwise return the mapped value when present. If the key is absent
				// return null (not the whole items object which may be {}).
				var value;
				if (items != null && typeof items === 'object') {
					value = Object.prototype.hasOwnProperty.call(items, key) ? items[key] : null;
				}
				else {
					// Some implementations may return the primitive value directly
					value = items;
				}

				if (value == null)
					value = null;
				return value;
			} catch (e) {
				Foxtrick.log(`Error in session.get(${key})`, e);
				return null;
			}
		}).catch(e => {
			Foxtrick.log(`Error in session.get(${key})`, e);
			return null;
		});
	}

	return new Promise(resolve => {
		try {
			if (key == null) {
				// return the whole in-memory store (shallow copy)
				resolve(Object.assign({}, Foxtrick.session.__STORE));
				return;
			}

			var value = Foxtrick.session.__STORE[key];

			// cast undefined to null
			if (value == null)
				value = null;

			resolve(value);
		} catch (e) {
			Foxtrick.log(`Error in session.get(${key})`, e);
			resolve(null);
		}
	});
};

/**
 * Get a promise for when a certain session branch is deleted
 *
 * @param  {string}  branch
 * @returns {Promise}
 */
Foxtrick.session.deleteBranch = function(branch) {

	if (Foxtrick.context == 'content') {
		return new Promise((fulfill, reject) => {
			Foxtrick.SB.ext.sendRequest({
				req: 'sessionDeleteBranch',
				branch: branch,
			}, function onSendResponse(response) {

				var err = Foxtrick.jsonError(response);
				if (err instanceof Error)
					reject(err);
				else
					fulfill(response);

			});
		});
	}

	// background/service-worker: prefer storage.session when available
	var api = Foxtrick.session._getSessionApi();
	if (api) {
		return Promise.resolve(api.get(null)).then(items => {
			try {
				var br = branch == null ? '' : branch.toString();
				var toSet = {};
				//@ts-ignore
				for (var k in items) {
					if (k.indexOf(br) === 0)
						toSet[k] = null;
				}
				if (Object.keys(toSet).length === 0)
					return;
				return api.set(toSet);
			} catch (e) {
				Foxtrick.log(`Error in session.deleteBranch(${branch}) `, e);
			}
		}).catch(e => {
			Foxtrick.log(`Error in session.deleteBranch(${branch})`, e)
		});
	}

	return new Promise(resolve => {
		let br;
		if (branch == null)
			br = '';

		br = branch.toString();

		for (var key in Foxtrick.session.__STORE) {
			if (key.indexOf(br) === 0)
				Foxtrick.session.__STORE[key] = null;
		}

		resolve();
	});

};


// /////////////////////////
// TODO: remove deprecated
// ////////////////////////

/**
 * Save a value in temporary storage
 *
 * @deprecated use session.set() instead
 * @param {string} key
 * @param {object} value
 */
Foxtrick.sessionSet = function(key, value) {
	Foxtrick.session.set(key, value).catch(Foxtrick.catch('sessionSet'));
};

/**
 * Get a value from temporary storage
 *
 * @deprecated use session.get() instead
 * @param {string}   key
 * @param {function(any):any} callback
 */
Foxtrick.sessionGet = function(key, callback) {
	Foxtrick.session.get(key).then(callback).catch(Foxtrick.catch('sessionGet'));
};

/**
 * Remove a branch from temporary storage
 *
 * @deprecated use session.deleteBranch() instead
 * @param {string} branch
 */
Foxtrick.sessionDeleteBranch = function(branch) {
	Foxtrick.session.deleteBranch(branch).catch(Foxtrick.catch('sessionDeleteBranch'));
};
