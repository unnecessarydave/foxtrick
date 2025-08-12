'use strict';

Foxtrick.modules['LogogramPlayerNames'] = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.PRESENTATION,
	PAGES: ['playerDetails', 'youthPlayerDetails', 'allPlayers', 'youthPlayers', 'youthOverview', 'trainerDetails', 'match', 'transfersTeam', 'coach', 'specialistDetails', 'transferSearchResult', 'teamOfTheWeek'],
	RADIO_OPTIONS: ['NO_LATIN', 'NO_LOGOGRAMS', 'NO_CHANGES'],

	/**
	 * Main entry point for the module.
	 * @param {Document} doc The document object for the current page.
	 */
	run: function(doc) {
		const module = this;
		const option = Foxtrick.Prefs.getModuleValue(module);

		const nodes = [
			// Player name in player details
			{
				elements: doc => [doc.querySelector('#mainBody h1.hasByline.flex-inline')],
				getPlayerName: element => element.childNodes[2].textContent,
				updatePlayerName: (element, playerName) => {
					element.childNodes[2].textContent = playerName;
				}
			},
			// Page title
			{
				elements: doc => [doc.querySelector('head title')],
				getPlayerName: element => element.textContent.split('»')[0],
				updatePlayerName: (element, playerName) => {
					const separator = '»';
					const titleSplitted = element.textContent.split(separator)
					titleSplitted[0] = playerName;
					element.textContent = titleSplitted.join(separator);
				}
			},
			// All links to player details
			{
				elements: doc => Array.from(doc.querySelectorAll('a[href]')).filter(a => new RegExp(/https:\/\/www\d*\.hattrick\.org\/Club\/Players\/(YouthPlayer|Player)\.aspx/).test(a.href)).filter(elem => elem.childElementCount === 0),
				getPlayerName: element => element.textContent,
				updatePlayerName: (element, playerName) => {
					element.textContent = playerName;
					if (element.attributes['title']) {
						element.attributes['title'].textContent = playerName;
					}
				}
			},
			// Scouts
			{
				elements: doc => doc.querySelectorAll('.scout-details-text-name span b'),
				getPlayerName: element => element.textContent,
				updatePlayerName: (element, playerName) => element.textContent = playerName
			},
			// Title of the Player/Coach
			{
				elements: doc => doc.querySelectorAll('#mainBody .hasByline'),
				getPlayerName: element => element.childNodes[0].textContent,
				updatePlayerName: (element, playerName) => element.childNodes[0].textContent = playerName
			},
			// Last name in match report
			{
				elements: doc => doc.querySelectorAll('a .playerName .lastName'),
				getPlayerName: element => element.textContent,
				updatePlayerName: (element, playerName) => element.textContent = playerName
			},
			// First name of full name in match report
			{
				elements: doc => doc.querySelectorAll('a .playerName .fullName'),
				getPlayerName: element => element.childNodes[0].textContent,
				updatePlayerName: (element, playerName) => element.childNodes[0].textContent = playerName
			},
			// Last name of full name in match report
			{
				elements: doc => doc.querySelectorAll('a .playerName .fullName'),
				getPlayerName: element => element.childNodes[2].textContent,
				updatePlayerName: (element, playerName) => element.childNodes[2].textContent = playerName
			},
			// Change coach select
			{
				elements: doc => doc.querySelectorAll('.box.mainBox select optgroup option'),
				getPlayerName: element => element.textContent.match(/\b\d+\.\s(.*?)\s+-/)[1],
				updatePlayerName: (element, playerName) => {
					const originalPlayerName = element.textContent.match(/\b\d+\.\s(.*?)\s+-/)[1];
					if (!originalPlayerName) return;
					element.textContent = element.textContent.replace(originalPlayerName, playerName);
				}
			},
			// Team of the week
			{
				elements: doc => doc.querySelectorAll('a .playerName .fullName'),
				getPlayerName: element => element.textContent,
				updatePlayerName: (element, playerName) => element.textContent = playerName
			}
		];
		console.log('LogogramPlayerNames nodes:', nodes);

		/**
		 * Execute player name replacement logic for all relevant nodes.
		 * @param {Document} doc The document object for the current page.
		 */
		function execute(doc) {
			nodes.forEach(node => {
				const elements = node.elements(doc);
				if (!elements || Array.from(elements).filter(el => el).length === 0) {
					console.warn('LogogramPlayerNames: No elements found for player name');
					return;
				}
				elements.forEach(element => {
					const originalPlayerName = node.getPlayerName(element);
					if (!originalPlayerName) {
						console.warn('LogogramPlayerNames: No player name found');
						return;
					}
					const fixedPlayerName = fixLogogramPlayerName(originalPlayerName, option);
					node.updatePlayerName(element, fixedPlayerName);
				})
			})
		}

		/**
		 * @param {string} playerName The name of the player
		 * @param {number} mode 0 = no changes, 1 = only logograms 2 = only letters
		 * @returns {string} The name of the player fixed
		 * @description TODO
		 */
		// TODO: change function name
		function fixLogogramPlayerName(playerName, mode) {
			switch (mode) {
				case 0:
					return extractLogograms(playerName)
				case 1:
					return extractLetters(playerName)
				case 2:
				default:
					return playerName;		
			}
		}

		/**
		 * @param {string} playerName
		 * @returns {string}
		 */
		function extractLogograms(playerName) {
			// FIXME: 姚. 崇晖 (Chonghui -> DONT'T WORKS
			return playerName.replace(/\s*\([^)]+\)/g, '');
		}

		/**
		 * @param {string} playerName
		 * @returns {string}
		 */
		function extractLetters(playerName) {
			// FIXME: this regex is not perfect, it trim spaces after the last letter
			const regex = /\(\s*([^)]+?)\s*\)/g;
			let match;
			const results = [];

			while ((match = regex.exec(playerName)) !== null) {
				results.push(match[1]);
			}

			return results.length > 0 ? results.join(' ') : playerName;
		}

		// Add callback listener for Match
		if (Foxtrick.isPage(doc, 'match')) {
			let container = doc.querySelector('#ctl00_ctl00_CPContent_divStartMain ht-live');
			container && Foxtrick.onChange(
				container, execute,
				{ childList: true, subtree: true }
			);
		}

		// Add callback listener for Team of the week
		if (Foxtrick.isPage(doc, 'teamOfTheWeek')) {
			let container = doc.querySelector('#ctl00_ctl00_CPContent_divStartMain ng-app');
			container && Foxtrick.onChange(
				container, execute,
				{ childList: true, subtree: true }
			);
		}

		// Execute player name replacement
		execute(doc);
	}
};