'use strict';
/**
 * team-select-box.js
 * Foxtrick team select box
 * @author convinced, ryanli
 */

Foxtrick.modules['TeamSelectBox'] = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.PRESENTATION,
	PAGES: ['allPlayers', 'youthPlayers'],

	run: function(doc) {
		var listBox; // sidebarBox containing player list
		var sidebarBoxes = doc.getElementsByClassName('sidebarBox');

		// take the one with most links
		// which should be the one with the players

		// sidebarBoxes is not an array, we create an array from it
		var isPlayerLink = function(n) {
			return n.href.search(/playerId=(\d+)/i) != -1;
		};
		var linkBoxes = Foxtrick.filter(function(n) {
			return n.getElementsByTagName('a').length > 0
				&& isPlayerLink(n.getElementsByTagName('a')[0]);
		}, sidebarBoxes);
		if (linkBoxes.length == 0)
			return; // listBox may not be present on oldies page

		linkBoxes.sort(function(a, b) {
			var aLinks = Foxtrick.filter(isPlayerLink, a.getElementsByTagName('a'));
			var bLinks = Foxtrick.filter(isPlayerLink, b.getElementsByTagName('a'));
			return bLinks.length - aLinks.length;
		});
		listBox = linkBoxes[0];
		var listTable = listBox.getElementsByTagName('table')[0];

		if (!listTable || listTable.rows.length <= 1)
			return; // zero or one player in the list

		var header = listBox.getElementsByTagName('h2')[0];
		var boxHead = header.parentNode;
		var sidebarBox = Foxtrick.addBoxToSidebar(doc, header.textContent, null, 0, false, true)
		sidebarBox.id = 'ft-team-select-box';

		var toList = function() {
			toggleSelectBox();
		};

		var toSelectBox = function() {
			if (toggleSelectBox())
				return;

			// create a select box with all players
			var selectBox = doc.createElement('select');
			var selected = function() {
				doc.location.href = selectBox.value;
			};
			Foxtrick.listen(selectBox, 'change', selected, false);

			var option = doc.createElement('option');
			option.textContent = Foxtrick.L10n.getString('TeamSelectBox.selectplayer');
			selectBox.appendChild(option);

			var players = listTable.getElementsByTagName('a');
			for (var i = 0; i < players.length; ++i) {
				var player = players[i];
				if (player.href.trim().length == 0)
					continue;

				option = doc.createElement('option');
				option.value = player.href;
				option.textContent = player.textContent;
				selectBox.appendChild(option);
			}
			var boxBody = listBox.getElementsByClassName('boxBody')[0];
			if (boxBody) {
				Foxtrick.toggleClass(listTable, 'hidden');
				boxBody.appendChild(selectBox);
			}
		};

		/**
		 * Toggle between list and select box
		 * @returns {boolean} true if select box was toggled
		 */
		var toggleSelectBox = function() {
			var selectBox = listBox.getElementsByTagName('select')[0];
			if (selectBox && listTable) {
				Foxtrick.toggleClass(selectBox, 'hidden');
				Foxtrick.toggleClass(listTable, 'hidden');
				return true;
			}
			return false
		}

		var showAsList = true; // is shown as list initially
		var toggle = function() {
			try {
				showAsList = !showAsList;
				(showAsList) ? toList() : toSelectBox();
			}
			catch (e) {
				Foxtrick.log(e);
			}
		};
		Foxtrick.onClick(boxHead, toggle);
		toggle();
	}
};
