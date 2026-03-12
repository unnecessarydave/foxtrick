/**
* extra-shortcuts.js
* Adds an imagelink to the shortcut
* @author baumanns, spambot, LA-MJ
*/

'use strict';

Foxtrick.modules['ExtraShortcuts'] = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.SHORTCUTS_AND_TWEAKS,
	OUTSIDE_MAINBODY: true,
	PAGES: ['all'],
	OPTIONS: [
		'AddSpace',
		'AddLeft',
		'FoxTrickPrefs',
		'Stage',
		'Supporterstats', 'Transfers', 'Prefs', 'ManageCHPP',
	],
	LINKS: {
		Stage: {
			link: '',
			imgClass: 'ftStageLink',
			property: 'stage',
		},
		Supporterstats: { link: '/World/Stats/', imgClass: 'ftSuppStats', property: 'statistics' },
		Transfers: { link: '/Club/Transfers/', imgClass: 'ftMyTransfers', property: 'transfers' },
		Prefs: { link: '/MyHattrick/Preferences/', imgClass: 'ftSCPrefs', property: 'prefs' },
		ManageCHPP: {
			link: '/MyHattrick/Preferences/ExternalAccessGrants.aspx',
			imgClass: 'ftManageCHPP',
			property: 'ManageCHPP',
		},
	},

	CSS: Foxtrick.InternalPath + 'resources/css/extra-shortcuts.css',

	OPTIONS_CSS: [
		Foxtrick.InternalPath + 'resources/css/extra-shortcuts-space.css',
	],

	/** @param {document} doc */
	// eslint-disable-next-line complexity
	run: function(doc) {
		const module = this;

		const STAGE_ORIGIN = 'https://stage.hattrick.org';
		const PROD_ORIGIN = 'https://www.hattrick.org';

		let origin = doc.location.origin;
		// eslint-disable-next-line no-restricted-properties
		let relative = doc.location.pathname + doc.location.search;
		let link = new URL(relative, origin == STAGE_ORIGIN ? PROD_ORIGIN : STAGE_ORIGIN);
		module.LINKS.Stage.link = link.href;

		var shortcuts = doc.getElementById('shortcuts') ||
			doc.getElementById('shortcutsNoSupporter');
		if (!shortcuts)
			return;

		var targetNode = shortcuts.querySelector('div.scContainer, div.scContainerNoSupporter');
		if (!targetNode)
			return;

		for (let [name, link] of Object.entries(module.LINKS)) {
			if (!Foxtrick.Prefs.isModuleOptionEnabled('ExtraShortcuts', name))
				continue;

			let anchor = doc.createElement('a');
			anchor.className = 'ft_extra-shortcuts';
			anchor.href = link.link;

			let img1 = doc.createElement('img');
			img1.setAttribute('class', link.imgClass);
			img1.src = '/Img/Icons/transparent.gif';
			img1.title = Foxtrick.L10n.getString('ExtraShortcuts.' + link.property);
			img1.alt = Foxtrick.L10n.getString('ExtraShortcuts.' + link.property);
			img1 = Foxtrick.makeFeaturedElement(img1, module);

			anchor.appendChild(img1);
			if (Foxtrick.Prefs.isModuleOptionEnabled('ExtraShortcuts', 'AddLeft'))
				targetNode.insertBefore(anchor, targetNode.firstChild);
			else if (targetNode.lastChild.nodeName == 'BR')
				targetNode.insertBefore(anchor, targetNode.lastChild);
			else
				targetNode.appendChild(anchor);
		}

		if (Foxtrick.Prefs.isModuleOptionEnabled('ExtraShortcuts', 'FoxTrickPrefs')) {
			let link = doc.createElement('a');
			link.className = 'ft_extra-shortcuts ft-link';
			Foxtrick.onClick(link, () => Foxtrick.Prefs.show('#tab=on_page'));
			let img1 = doc.createElement('img');
			img1.setAttribute('class', 'ftSCFtPrefs');
			img1.src = '/Img/Icons/transparent.gif';
			img1.title = Foxtrick.L10n.getString('ExtraShortcuts.ftprefs');
			img1.alt = Foxtrick.L10n.getString('ExtraShortcuts.ftprefs');
			img1 = Foxtrick.makeFeaturedElement(img1, module);

			link.appendChild(img1);
			if (Foxtrick.Prefs.isModuleOptionEnabled('ExtraShortcuts', 'AddLeft'))
				targetNode.insertBefore(link, targetNode.firstChild);
			else if (targetNode.lastChild.nodeName == 'BR')
				targetNode.insertBefore(link, targetNode.lastChild);
			else
				targetNode.appendChild(link);
		}

	},
};
