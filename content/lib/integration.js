'use strict';

/* global globalThis */

// TODO find a way to fake AMD define to satisfy all libs
// redefine external libs on top of Foxtrick
// for those contexts where boot-strap does not take affect
(function() {
	const LIBS = [
		'jsyaml',
		'IDBStore',
		'Gauge',
		'Donut',
		'BaseDonut',
		'TextRenderer',
		'AnimationUpdater',
		'Sentry',
	];

	LIBS.forEach((lib) => {
		var global = typeof globalThis == 'undefined' || typeof globalThis[lib] == 'undefined'
			? window
			: globalThis;

		if (typeof Foxtrick[lib] == 'undefined')
			Foxtrick[lib] = global[lib];

		try {
			global[lib] = void 0;
			delete global[lib];
		}
		catch (e) { }
	});

})();
