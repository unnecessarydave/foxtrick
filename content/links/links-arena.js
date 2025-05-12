'use strict';
/**
 * linksyouthoverview.js
 * Foxtrick add links to arena pages
 * @author convinced, LA-MJ
 */

Foxtrick.modules['LinksArena'] = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.LINKS,
	PAGES: ['arena'],
	LINK_TYPES: 'arenalink',
	SEATING_TYPES: ['terraces', 'basic', 'roof', 'vip'],
	/**
	 * return HTML for FT prefs
	 * @param  {document}         doc
	 * @param  {function}         cb
	 * @return {HTMLUListElement}
	 */
	OPTION_FUNC: function(doc, cb) {
		return Foxtrick.util.links.getPrefs(doc, this, cb);
	},

	run: function(doc) {
		Foxtrick.util.links.run(doc, this);
	},

	links: function(doc) {
		let arenaInfo = doc.querySelector('div.arenaInfo');
		let arenaExpansion = doc.querySelector('ng-app[app="arena-expansion"]');
		if (!arenaInfo && !arenaExpansion)
			return;
		let SEATING_TYPES = Foxtrick.modules.LinksArena.SEATING_TYPES;
		let arenaId = Foxtrick.Pages.All.getId(doc);
		let teamId = Foxtrick.Pages.All.getTeamId(doc);
		let info = { teamId: teamId, arenaId: arenaId, };
		for (let seating of SEATING_TYPES) info[seating] = null;
		let retVal = {info: info};

		let rowIdx;  // Row index of the first seating row
		let arenaTable;

		if (arenaInfo) {
			// We are on the stadium page.
			arenaTable = arenaInfo.getElementsByTagName('table')[0];
			/**
			 * Determine the index of the first seating row based on row count:
			 * - expanded stadiums have a 'Last improvement' row ahead of the seating rows
			 * - there are 2 additional rows at the bottom if the stadium is owned by the user
			 */
			rowIdx = arenaTable.rows.length == 6 || arenaTable.rows.length == 8 ? 2 : 3;
		}

		if (arenaExpansion) {
			// We are on the stadium expansion page.
			arenaTable = arenaExpansion.getElementsByTagName('table')[0];
			rowIdx = 2;
		}

		if (arenaTable) {
			for (let seating of SEATING_TYPES) {
				info[seating] = Foxtrick.trimnum(arenaTable.rows[rowIdx].cells[1].textContent);
				rowIdx++;
			}
		}
		return retVal;
	}
};
