/**
 * permissions.js
 * chrome permissions management
 * http://developer.chrome.com/extensions/permissions.html
 */

'use strict';

/* eslint-disable */
if (!this.Foxtrick)
	// @ts-ignore
	var Foxtrick = {};
/* eslint-enable */

Foxtrick.containsPermission = function(types, callback) {
	if (Foxtrick.platform == 'Chrome') {
		if (Foxtrick.context == 'content') {
			Foxtrick.SB.ext.sendRequest({ req: 'containsPermission', types: types }, function(response) {
				if (response && response.__permError) {
					Foxtrick.log(new Error('containsPermission: ' + response.__permError));
					callback(undefined);
				}
				else {
					callback(response);
				}
			});
		} else {
			if (Foxtrick.Manifest.manifest_version == 3) {
				try {
					chrome.permissions.contains(types)
						.then( result => callback(result) )
						.catch( err => callback({ __permError: String(err) }) );
				} catch (e) {
					callback({ __permError: String(e) });
				}
			} else {
				chrome.permissions.contains(types, callback);
			}
		}
		return;
	}
	callback(true);
};

// Needs to be invoked by user gesture, such as an onclick handler
Foxtrick.requestPermission = function(types, callback) {
	if (Foxtrick.platform == 'Chrome') {
		if (Foxtrick.context == 'content') {
			// Foxtrick.SB.ext.sendRequest({ req: 'requestPermission', types: types },
			//   function(response) {
			// 	callback(response);
			// });
			throw Error("can't request permission from content scripts");
		}
		else if (Foxtrick.hasProp(chrome, 'permissions')) {
			chrome.permissions.request(types, callback);
		}
		else {
			browser.permissions.request(types).then(callback);
		}
		return;
	}
	callback(true);
};

// Needs to be invoked by user gesture, such as an onclick handler
Foxtrick.removePermission = function(types, callback) {
	if (Foxtrick.platform == 'Chrome') {
		if (Foxtrick.context == 'content') {
			// Foxtrick.SB.ext.sendRequest({ req: 'removePermission', types: types },
			//   function(response) {
			// 	callback(response);
			// });
			throw Error("can't remove permission from content scripts");
		}
		else {
			chrome.permissions.request(types, callback);
		}
		return;
	}
	callback(false);
};
