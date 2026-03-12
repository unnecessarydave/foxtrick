// Minimal shim: ensure `window` exists in the service worker/global scope so
// imported scripts (for example polyfills) that bind to `window` attach to
// the correct global object.
if (typeof window === 'undefined') {
	const _global = (typeof globalThis !== 'undefined') ? globalThis : (typeof self !== 'undefined' ? self : this);
	try {
		Object.defineProperty(_global, 'window', {
			value: _global,
			configurable: true,
			enumerable: false,
			writable: true,
		});
	} catch (err) {
		// If defineProperty fails in some environments, fall back to direct assignment.
		// Reference the error to satisfy linters that disallow unused vars.
		void err;
		_global.window = _global;
	}
	// Mirror common aliases expected by libraries.
	_global.window.self = _global;
	_global.window.window = _global.window;
}