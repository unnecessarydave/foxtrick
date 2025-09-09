/**
 * prefs-util.js
 * Foxtrick preferences service
 *
 * Prefs can be accessed from both content & background.
 * However, different browsers have a different architecture.
 * Consequently, prefs-util has quite a complicated internal flow.
 * Consult the following diagrams.
 *
 * ------------ FF -------------
 *
 * [BG] getString(key)==[C] getString(key) // direct access
 * [BG] setString(key)
 * =>[BG] __cleanString(val)
 * =>[BG] __setString(key, val)
 *
 * [C] setString(key)
 * =>[C] __cleanString(val)
 * =>[C] __setString(key, val)
 *
 * [C] setAny(key, val)
 * =>[C] setString(key, val)
 * 	=> ...
 *
 * ------------ Android -------------
 *
 * [BG] getString(key)==[C] getString(key) // direct access
 *
 * [BG] setString(key, val)
 * =>[BG] __cleanString(val)
 * =>[BG] __setString(key, val)
 *
 * [C] setString(key, val)
 * =>[C] __cleanString(val)
 * =>[BG] getAny(key)
 * 	=>[BG] getString(key) // each type
 * =>[BG] setWithType(key, val, type)
 * 	=>[BG] __setString(key, val)
 *
 * [C] setAny(key, val)
 * =>[C] setString(key, val)
 * 	=> ...
 *
 * ------------ Chrome -------------
 *
 * [BG] getString(key)
 * =>[BG] __get(key)
 *
 * [C] getString(key)
 * =>[C] __get(key) // cached
 *
 * [BG] setString(key, val)
 * =>[BG] __cleanString(val)
 * =>[BG] __set(key, val)
 *
 * [C] setString(key, val)
 * =>[C] __cleanString(val)
 * =>[C] __set(key, val)
 * 	=>[BG] getAny(key)
 * 		=>[BG] getString(key) // each type
 * 			=>[BG] __get(key)
 * 	=>[BG] setWithType(key, val)
 * 		=> [BG] __set(key, val)
 *
 * [C] setAny(key, val)
 * =>[C] setString(key, val)
 * 	=> ...
 *
 * @author Mod-PaV, ryanli, convincedd, LA-MJ
 */

'use strict';

/* eslint-disable */
if (!this.Foxtrick)
	// @ts-ignore
	var Foxtrick = {};
/* eslint-enable */

/* eslint-disable consistent-this */
Foxtrick.Prefs = (() => ({
	// --------------------- function stubs ----------------

	/* eslint-disable no-unused-vars */

	/**
	 * @param {boolean} [reInit]
	 */
	init(reInit) { },

	/**
	 * Test if user has saved a custom value for key
	 *
	 * @param  {string}  key pref key to check
	 * @return {boolean}
	 */
	hasUserValue(key) { return false; },

	/**
	 * Get all preference entry keys under a branch.
	 *
	 * - if branch is '', return the names of all entries;
	 * - if branch is not '', return the names of entries with name
	 * starting with the branch name.
	 *
	 * @param  {string}   [branch] branch to fetch
	 * @return {string[]}          array of key names
	 */
	getAllKeysOfBranch(branch) { return []; },

	/**
	 * Remove a saved pref value
	 *
	 * @param {string} key key to delete
	 */
	deleteValue(key) {},

	/**
	 * Get an integer value from prefs
	 *
	 * @param  {string} key pref key
	 * @return {number}     pref value {Integer}
	 */
	getInt(key) { return 0; },

	/**
	 * Get a boolean value from prefs
	 *
	 * @param  {string}  key pref key
	 * @return {boolean}     pref value
	 */
	getBool(key) { return false; },

	/**
	 * Get a string value from prefs
	 *
	 * @param  {string} key pref key
	 * @return {string}     pref value
	 */
	getString(key) { return ''; },

	/**
	 * Save an integer value in prefs
	 *
	 * README: DO NOT use floats here, use setString instead
	 *
	 * @param {string} key   pref key
	 * @param {number} value pref value {Integer}
	 */
	setInt(key, value) {},

	/**
	 * Save a boolean value in prefs
	 *
	 * @param {string}  key   pref key
	 * @param {boolean} value pref value
	 */
	setBool(key, value) {},

	/**
	 * Save a string value in prefs
	 *
	 * @param {string} key   pref key
	 * @param {string} value pref value
	 */
	setString(key, value) {},

	/* eslint-enable no-unused-vars */

}))();


// ----------------------- sanitize functions ------------------------

/**
 * Replace a backspace-escaped sequence with it's meaning
 *
 * @param  {string} escaped
 * @return {string}
 */
Foxtrick.Prefs.__unescape = function(escaped) {
	switch (escaped.charAt(1)) {
		case 't':
		case '\t':
			return '\t';
		case 'n':
			return '\n';
		case 'r':
			return '\r';
		case ' ':
			return ' ';
		case '"':
			return '"';
		case '/':
			return '/';
		case '\\':
			return '\\';
		default:
			return escaped;
	}
};

Foxtrick.Prefs.__cleanInt = function(num) {
	return parseInt(num, 10) || 0;
};

Foxtrick.Prefs.__cleanBool = function(bool) {
	return Boolean(bool);
};

Foxtrick.Prefs.__cleanString = function(str) {
	return String(str).replace(/\\./g, this.__unescape);
};

// ----------------------- generic functions -------------------------

/**
 * Get an entry from preferences with generic type.
 *
 * Should not be used in modules!
 * return null if not found
 *
 * @param  {string} key pref key
 * @return {any}        value
 */
Foxtrick.Prefs.getAny = function(key) {
	var val;
	if ((val = this.getString(key)) != null)
		return val;

	if ((val = this.getInt(key)) != null)
		return val;

	if ((val = this.getBool(key)) != null)
		return val;

	return null;
};

/**
 * Set a value in prefs.
 *
 * Should not be used in modules!
 * Must pass floats as strings!
 *
 * @param {string} key
 * @param {any}    value
 */
Foxtrick.Prefs.setAny = function(key, value) {
	var map = {
		string: this.setString.bind(this),
		number: this.setInt.bind(this),
		boolean: this.setBool.bind(this),
	};

	var type = typeof value;
	if (map[type])
		map[type](key, value);
	else
		throw new TypeError('Type error: value is ' + type);
};

// ----------------------- list functions ----------------------------

// List are sets of numbered settings which contain titles
// and the values corresponding to that title
// e.g. templatelist.0 = 'MyTemplate'
// template.MyTemplate = 'Hello and Goodbye'

/**
 * Add a new preference with a value under a specified branch.
 *
 * Creates the list if not present.
 * Returns true if added (false if empty or already on the list).
 *
 * @param  {string}  branch
 * @param  {string}  value
 * @return {boolean}        is newly added
 */
Foxtrick.Prefs.addPrefToList = function(branch, value) {
	if (!value)
		return false;

	var values = this.getList(branch);

	// already exists?
	var exists = Foxtrick.has(values, value);
	if (exists)
		return false;

	values.push(value);
	this.populateList(branch, values);

	return true;
};

/**
 * Return a pref list as an array.
 *
 * Elements are sorted as a queue.
 *
 * @param  {string} branch pref branch
 * @return {any[]}         {Array.<mixed>}
 */
Foxtrick.Prefs.getList = function(branch) {
	/**
	 * @param  {string} key
	 * @return {number}
	 */
	var getNum = function(key) {
		let numStr = key.slice(branch.length + 1); // skip '.'
		return parseInt(numStr, 10);
	};

	var keys = this.getAllKeysOfBranch(branch);
	keys.sort(function(a, b) {
		let aNum = getNum(a) || 0;
		let bNum = getNum(b) || 0;
		return aNum - bNum;
	});

	return Foxtrick.map(function(k) {
		return Foxtrick.Prefs.getAny(k);
	}, keys);
};

/**
 * Remove an element-by-value from a pref list
 *
 * @param {string} branch   pref branch
 * @param {any}    delValue value to remove
 */
Foxtrick.Prefs.delListPref = function(branch, delValue) {
	var values = this.getList(branch);

	values = Foxtrick.filter(function(e) {
		return e != delValue;
	}, values);

	this.populateList(branch, values);
};

/**
 * Populate an array as a pref list.
 *
 * branch is cleaned before populating.
 *
 * @param {string} branch pref branch
 * @param {any[]}  values {Array.<mixed>}
 */
Foxtrick.Prefs.populateList = function(branch, values) {
	var keys = this.getAllKeysOfBranch(branch);

	for (let key of keys)
		this.deleteValue(key);

	for (let i = 0; i < values.length; ++i)
		this.setAny(decodeURI(branch + '.' + i), values[i]);
};


// ---------------------- module functions --------------------------------------

/**
 * Test whether Foxtrick is enabled on this page
 *
 * @param  {document} doc
 * @return {boolean}
 */
Foxtrick.Prefs.isEnabled = function(doc) {
	if (this.getBool('disableTemporary'))
		return false;

	if (this.getBool('disableOnStage') && Foxtrick.isStage(doc))
		return false;

	if (!this.getBool('runLoggedOff') && Foxtrick.isLoginPage(doc))
		return false;

	return true;
};

/**
 * Test whether a Foxtrick module is enabled.
 *
 * module may be module name or object.
 *
 * @param  {string|FTAppModuleMixin} module {string|FTAppModuleMixin}
 * @return {boolean}
 */
Foxtrick.Prefs.isModuleEnabled = function(module) {
	let m = typeof module === 'string' ? Foxtrick.modules[module] : module;

	if (!m)
		return false;

	// core modules must be executed no matter what user's preference is
	if (m.CORE_MODULE)
		return true;

	return this.getBool('module.' + m.MODULE_NAME + '.enabled');
};

/**
 * Test whether a Foxtrick module option is enabled.
 *
 * module may be module name or object.
 *
 * @param  {string|FTAppModuleMixin} module {string|FTAppModuleMixin}
 * @param  {string}        option
 * @return {boolean}
 */
Foxtrick.Prefs.isModuleOptionEnabled = function(module, option) {
	let m = typeof module == 'string' ? module : module && module.MODULE_NAME || null;
	return this.getBool('module.' + m + '.' + option + '.enabled');
};

/**
 * Test whether a Foxtrick module option is set,
 * i. e. has a non-default value.
 *
 * module may be module name or object.
 *
 * @param  {string|FTAppModuleMixin} module {string|FTAppModuleMixin}
 * @param  {string}        option
 * @return {boolean}
 */
Foxtrick.Prefs.isModuleOptionSet = function(module, option) {
	let m = typeof module == 'string' ? module : module && module.MODULE_NAME || null;
	return this.hasUserValue('module.' + m + '.' + option + '.enabled');
};

/**
 * Set whether module is enabled.
 *
 * module may be module name or object.
 * module option may be specified as 'moduleName.optionName'.
 *
 * @param {string|FTAppModuleMixin} module
 * @param {boolean}       value
 */
Foxtrick.Prefs.setModuleEnableState = function(module, value) {
	let m = typeof module == 'string' ? module : module && module.MODULE_NAME || null;
	this.setBool('module.' + m + '.enabled', value);
};

/**
 * Set module option text, i.e. value in a text field.
 *
 * module may be module name or object.
 * module option may be specified as 'moduleName.optionName'.
 *
 * @param {string|FTAppModuleMixin} module
 * @param {string}        value
 */
Foxtrick.Prefs.setModuleOptionsText = function(module, value) {
	let m = typeof module == 'string' ? module : module && module.MODULE_NAME || null;
	this.setString('module.' + m, value);
};

/**
 * Get module value, i.e. the index of checked radio button.
 *
 * module may be module name or object.
 *
 * @param  {string|FTAppModuleMixin} module
 * @return {number}               {Integer}
 */
Foxtrick.Prefs.getModuleValue = function(module) {
	let m = typeof module == 'string' ? module : module && module.MODULE_NAME || null;
	return this.getInt('module.' + m + '.value');
};

/**
 * Set module value, i.e. the index of checked radio button.
 *
 * module may be module name or object.
 *
 * @param {string|FTAppModuleMixin} module
 * @param {number}        value  {Integer}
 */
Foxtrick.Prefs.setModuleValue = function(module, value) {
	let m = typeof module == 'string' ? module : module && module.MODULE_NAME || null;
	this.setInt('module.' + m + '.value', value);
};

/**
 * Get localized module description.
 *
 * module may be module name or object.
 *
 * @param  {string|FTAppModuleMixin} module
 * @return {string}
 */
Foxtrick.Prefs.getModuleDescription = function(module) {
	let m = typeof module == 'string' ? module : module && module.MODULE_NAME || null;

	let name = 'module.' + m + '.desc';
	if (Foxtrick.L10n.isStringAvailable(name))
		return Foxtrick.L10n.getString(name);

	Foxtrick.log('Module not localized:', m);
	return m;
};

/**
 * Get localized module option description.
 *
 * module may be module name or object.
 *
 * @param  {string|FTAppModuleMixin} module
 * @param  {string}        option
 * @return {string}
 */
Foxtrick.Prefs.getModuleElementDescription = function(module, option) {
	let m = typeof module == 'string' ? module : module && module.MODULE_NAME || null;

	let name = 'module.' + m + '.' + option + '.desc';
	if (Foxtrick.L10n.isStringAvailable(name))
		return Foxtrick.L10n.getString(name);

	Foxtrick.log('Module option not localized:', m + '.' + option);
	return option;
};

/**
 * Test whether a pref key is an actual option,
 * but not a personal pref or oAuth token
 *
 * @param  {string}  key
 * @return {boolean}
 */
Foxtrick.Prefs.isPrefSetting = function(key) {
	return key.indexOf('oauth') !== 0 &&
		key.indexOf('transferfilter') !== 0 &&
		key.indexOf('post_templates') !== 0 && key.indexOf('mail_templates') !== 0 &&
		(key.indexOf('LinksCustom') !== 0 || key.indexOf('LinksCustom.enabled') === 0);
};

//  ----------------- preferences.js etc ---------------------------

/**
 * Restore default prefs.
 *
 * return value indicates success.
 *
 * @return {boolean}
 */
Foxtrick.Prefs.restore = function() {
	if (Foxtrick.arch == 'Gecko') {
		if (Foxtrick.context === 'background') {
			try {
				var keys = this.getAllKeysOfBranch('module');

				for (let key of keys) {
					if (this.isPrefSetting(key))
						this.deleteValue(key);
				}

				this.setBool('preferences.updated', true);
				Foxtrick.entry.init(true); // reInit

				return true;
			}
			catch (e) {
				Foxtrick.log(e);
				return false;
			}
		}
		else {
			Foxtrick.SB.ext.sendRequest({ req: 'clearPrefs' });
		}
	}
	else if (Foxtrick.arch == 'Sandboxed') {
		this.clear();

		if (Foxtrick.context === 'background') {
			if (Foxtrick.Manifest.manifest_version == 2) {
				for (let i in localStorage) {
					if (i.indexOf('localStore.') !== 0 && this.isPrefSetting(i))
						localStorage.removeItem(i);
				}
			}
			chrome.storage.local.clear();
		}
		else {
			Foxtrick.SB.ext.sendRequest({ req: 'clearPrefs' });
		}

		return true;
	}
	return false;
};

/**
 * Disable all modules and their options.
 *
 * return value indicates success.
 *
 * @return {boolean}
 */
Foxtrick.Prefs.disableAllModules = function() {
	try {
		var keys = this.getAllKeysOfBranch('module');

		for (let key of keys) {
			if (/enabled$/.test(key))
				this.setBool(key, false);
		}

		this.setBool('preferences.updated', true);
		Foxtrick.entry.init(true); // reInit
	}
	catch (e) {
		Foxtrick.log(e);
		return false;
	}
	return true;
};

/**
 * Save preferences.
 * Skips default values, CHPP tokens and notes by default.
 *
 * options is {format: string, defaults, oauth, notes, prefs, skipFiles: Boolean}
 *
 * @param  {object} options
 * @return {string}         preferences
 */
Foxtrick.Prefs.save = function(options) {
	var opts = {
		format: 'user_pref("extensions.foxtrick.prefs.%key",%value);',
		defaults: false, // include default values
		oauth: false, // include CHPP tokens
		notes: false, // include templates, filters
		prefs: true, // other prefs
		skipFiles: false, // whether to exclude dataURIs
	};
	Foxtrick.mergeValid(opts, options);

	try {
		var ret = '';

		var keys = this.getAllKeysOfBranch();
		keys.sort();
		keys = Foxtrick.unique(keys);

		const fileRe = /^data:\w+\/[\w\d.+-]+;base64,/;

		// eslint-disable-next-line complexity
		Foxtrick.forEach(function(key) {
			let isCustom = Foxtrick.Prefs.hasUserValue(key);
			let isRegular = Foxtrick.Prefs.isPrefSetting(key);
			let isOauth = key.indexOf('oauth.') === 0;

			if (!opts.defaults && !isCustom)
				return;

			if (isRegular && opts.prefs || isOauth && opts.oauth ||
				!isRegular && !isOauth && opts.notes) {

				let item = opts.format.replace(/%key/, key);

				let value = null;
				if ((value = Foxtrick.Prefs.getString(key)) !== null) {
					if (!opts.skipFiles || !fileRe.test(value)) {
						value = value.replace(/\n/g, '\\n');

						// README: quotes are not escaped here
						// the format regex takes care of it regardless
						item = item.replace(/%value/, '"' + value + '"');
					}
				}
				else if ((value = Foxtrick.Prefs.getInt(key)) !== null) {
					item = item.replace(/%value/, String(value));
				}
				else if ((value = Foxtrick.Prefs.getBool(key)) !== null) {
					item = item.replace(/%value/, String(value));
				}

				if (value !== null)
					ret += item + '\n';
			}

		}, keys);
		return ret;
	}
	catch (e) {
		Foxtrick.log(e);
		return null;
	}
};

/**
 * Parse a multi-line prefs string and run a callback for each key-value pair.
 *
 * Prefs must be organized one per line.
 *
 * @param {string}   string multi-line prefs string
 * @param {function} eachCb callback to run for each key-value pair
 */
Foxtrick.Prefs.parsePrefs = function(string, eachCb) {
	// README: quotes are not escaped here, the format regex takes care of it regardless
	var format = /(?:user_)?pref\("extensions\.foxtrick\.prefs\.(.+?)",(.+)\);/;

	var stringRe = /^(["'])(.*)\1$/;

	var lines = String(string).split(/[\r\n]+/);
	for (var line of lines) {
		if (line === '')
			continue;

		var matches = line.match(format);
		if (!matches) {
			Foxtrick.log('Warning: faulty pref', line);
			continue;
		}

		var key = matches[1];
		var value = matches[2].trim();

		try {
			if (value === 'true' || value === 'false')
				eachCb(key, value === 'true');
			else if (stringRe.test(value))
				eachCb(key, value.match(stringRe)[2]);
			else if (isNaN(parseInt(value, 10)))
				Foxtrick.log('Warning: faulty pref', key, value);
			else
				eachCb(key, parseInt(value, 10));
		}
		catch (e) {
			Foxtrick.log('Error in parsePrefs', e);
		}
	}
};

/**
 * Load a multi-line prefs string into prefs.
 *
 * Prefs must be organized one per line.
 *
 * @param {string} string
 */
Foxtrick.Prefs.load = function(string) {
	this.parsePrefs(string, function(key, value) {
		// skip old version
		if (key === 'oldVersion')
			return;

		Foxtrick.Prefs.setAny(key, value);

	});

	this.setBool('preferences.updated', true);
};

/**
 * Open the prefs page.
 *
 * page is actually an optional hash (#foo=bar)
 *
 * @param {string} [page]
 */
Foxtrick.Prefs.show = function(page) {
	Foxtrick.newTab(Foxtrick.InternalPath + 'preferences.html' + (page || '#tab=main'));
};

/**
 * Toggle Foxtrick disable state and reload all HT pages.
 *
 * sender is a message sender object used to locate the active tab and update the UI.
 *
 * @param {object} sender
 */
Foxtrick.Prefs.disable = function(sender) {
	this.setBool('disableTemporary', !this.getBool('disableTemporary'));
	Foxtrick.modules.UI.update(sender);
};

/**
 * Toggle Foxtrick feature highlighting.
 *
 * sender is a message sender object used to locate the active tab and update the UI.
 *
 * @param {object} sender
 */
Foxtrick.Prefs.highlight = function(sender) {
	this.setBool('featureHighlight', !this.getBool('featureHighlight'));

	Foxtrick.modules.UI.update(sender);

	if (Foxtrick.arch === 'Gecko')
		Foxtrick.entry.init(true); // reInit
};

/**
 * Toggle Foxtrick translation key display.
 *
 * sender is a message sender object used to locate the active tab and update the UI.
 *
 * @param {object} sender
 */
Foxtrick.Prefs.translationKeys = function(sender) {
	this.setBool('translationKeys', !this.getBool('translationKeys'));

	Foxtrick.modules.UI.update(sender);

	if (Foxtrick.arch === 'Gecko')
		Foxtrick.entry.init(true); // reInit

};

// wrap browser-specific configuration to prevent global scope pollution
(function() {

	// ------------------ Sandboxed-specific getters/setters --------------------
	if (Foxtrick.arch === 'Sandboxed') {

		var prefs = {
			_prefsChromeUser: {}, // contains mapped copies of user settings localStore.
			_prefsChromeDefault: {}, // defaults from Foxtrick.prefs

			__get: function(key) {
				if (key in this._prefsChromeUser)
					return this._prefsChromeUser[key];
				else if (key in this._prefsChromeDefault)
					return this._prefsChromeDefault[key];

				return null;
			},

			clear: function() {
				this._prefsChromeUser = {};
			},

			getString: function(key) {
				let value = this.__get(key);
				if (typeof value === 'string')
					return value;

				return null;
			},

			setString: function(key, value) {
				this.__set(key, Foxtrick.Prefs.__cleanString(value));
			},

			getInt: function(key) {
				let value = this.__get(key);
				if (typeof value === 'number')
					return Math.round(value) || 0;

				return null;
			},

			setInt: function(key, value) {
				this.__set(key, Foxtrick.Prefs.__cleanInt(value));
			},

			getBool: function(key) {
				let value = this.__get(key);
				if (typeof value === 'boolean')
					return value;

				return null;
			},

			setBool: function(key, value) {
				this.__set(key, Foxtrick.Prefs.__cleanBool(value));
			},

			hasUserValue: function(key) {
				return key in this._prefsChromeUser;
			},

			getAllKeysOfBranch: function(branch) {
				var prefix = branch ? encodeURI(branch + '.') : '';

				var ret = [];

				for (let userKey in this._prefsChromeUser) {
					if (userKey.indexOf(prefix) === 0) {
						if (!(userKey in this._prefsChromeDefault)) {
							// only if not in default to eliminate duplicates
							ret.push(userKey);
						}
					}
				}

				for (let key in this._prefsChromeDefault) {
					if (key.indexOf(prefix) === 0)
						ret.push(key);
				}

				return ret;
			},

			/**
			 * @return {[Record<string, *>, Record<string, *>]}
			 */
			package: function() {
				return [prefs._prefsChromeDefault, prefs._prefsChromeUser];
			},
		};

		if (Foxtrick.context == 'background') {

			var prefsBG = {
				init: async function() {
					// get preferences
					// this is used when loading from options page, not valid
					// in content script since access to localStorage is forbidden
					try {
						// user preferences
						prefs._prefsChromeUser = {};

						if (Foxtrick.Manifest.manifest_version == 2) {
							var length = localStorage.length;
							for (let i = 0; i < length; ++i) {
								let key = localStorage.key(i);

								// we don't want our localStore to get passed to pages
								// on every page load
								// those values are accessed async with Foxtrick.localStore
								if (key.indexOf('localStore') === 0)
									continue;

								let value = localStorage.getItem(key);

								try {
									prefs._prefsChromeUser[key] = JSON.parse(value);
								}
								catch (e) {
									Foxtrick.log('Preference parse error: key:', key, 'value:', value);
								}
							}
						} else {
							await this.initAsync(prefs._prefsChromeUser);
						}

						prefs._prefsChromeDefault = {};

						var parsePrefsFile = async (url) => {
							let string = await Foxtrick.util.load.internal(Foxtrick.InternalPath + url);

							Foxtrick.Prefs.parsePrefs(string, (key, value) => {
								this._prefsChromeDefault[key] = value;
							});
						};

						await parsePrefsFile('../defaults/preferences/foxtrick.js');
						if (Foxtrick.platform == 'Chrome')
							await parsePrefsFile('../defaults/preferences/foxtrick.chrome');
						else if (Foxtrick.platform == 'Safari')
							await parsePrefsFile('../defaults/preferences/foxtrick.safari');

					}
					catch (e) {
						Foxtrick.log(e);
					}

					if (Foxtrick.Manifest.manifest_version == 2) {
						this.initAsync(prefs._prefsChromeUser);
					}
				},

				initAsync: function(syncStore) {
					if (Foxtrick.platform === 'Safari')
						return;

					new Promise(function(resolve) {
						chrome.storage.local.get(null, resolve);
					}).then(function(store) {
						Object.assign(syncStore, store);
					});
				},

				// set and delete for background script side
				__set: function(key, value) {
					try {
						if (prefs._prefsChromeDefault[key] === value) {
							this.deleteValue(key);
						}
						else {
							prefs._prefsChromeUser[key] = value; // not default, set it
							if (Foxtrick.Manifest.manifest_version == 2)
								localStorage.setItem(key, JSON.stringify(value));

							var o = {
								[key]: value,
							};
							chrome.storage.local.set(o, function() {
								let e = chrome.runtime.lastError;
								if (e)
									Foxtrick.log('chrome.storage failed', e);
							});
						}
					}
					catch (e) {}
				},

				setWithType: function(key, value) {
					// README: ignoring type in Sandboxed: makes no difference
					this.__set(key, value);
				},

				deleteValue: function(key) {
					delete prefs._prefsChromeUser[key];
					if (Foxtrick.Manifest.manifest_version == 2)
						localStorage.removeItem(key);
					chrome.storage.local.remove(key);
				},

			};

			Object.assign(prefs, prefsBG);
		}


		if (Foxtrick.context == 'content') {
			// set and delete for contents script side
			var prefsFG = {

				__set: function(key, value) {

					try {
						if (this._prefsChromeDefault[key] === value) {
							// is default. deleting user pref, will set it to default
							this.deleteValue(key);
						}
						else {
							// not default, set it
							prefs._prefsChromeUser[key] = value;

							var msg = { req: 'setValue', key: key, value: value };
							Foxtrick.SB.ext.sendRequest(msg);
						}
					}
					catch (e) {}
				},

				/**
				 * @param {Record<string, *>} defaults
				 * @param {Record<string, *>} userVals
				 */
				load: function(defaults, userVals) {
					prefs._prefsChromeDefault = defaults;
					prefs._prefsChromeUser = userVals;
				},

				deleteValue: function(key) {
					delete prefs._prefsChromeUser[key];

					Foxtrick.SB.ext.sendRequest({ req: 'deleteValue', key: key });
				},
			};

			Object.assign(prefs, prefsFG);
		}

		Object.assign(Foxtrick.Prefs, {
			init: (...args) => prefs.init(...args),
			initContent: (...args) => prefs.load(...args),
			clone: () => prefs.package(),

			getString: (...args) => prefs.getString(...args),
			setString: (...args) => prefs.setString(...args),
			getBool: (...args) => prefs.getBool(...args),
			setBool: (...args) => prefs.setBool(...args),
			getInt: (...args) => prefs.getInt(...args),
			setInt: (...args) => prefs.setInt(...args),

			deleteValue: (...args) => prefs.deleteValue(...args),
			clear: () => prefs.clear(),
			hasUserValue: (...args) => prefs.hasUserValue(...args),
			setWithType: (...args) => prefs.setWithType(...args),
			getAllKeysOfBranch: (...args) => prefs.getAllKeysOfBranch(...args),
		});

	}

})();
