'use strict';
/**
* country-list.js
* displays country names in dropdown in different way
* @author spambot
*/

Foxtrick.modules['CountryList'] = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.PRESENTATION,
	PAGES: ['all'],
	OPTIONS: ['SelectBoxes', 'TeamPage', 'ManagerPage', 'UseEnglish', 'HideFlagOntop'],
	CSS: Foxtrick.InternalPath + 'resources/css/CountyList.css',

	run: function(doc) {
		var list = doc.getElementById('ft_countrylist');
		if (list !== null)
			return;
		var lgs = Foxtrick.getMBElement(doc, 'ddlLeagues');
		var lgs_lgs = Foxtrick.getMBElement(doc, 'ddlLeagues_ddlLeagues');
		var lgs2_lgs =
			doc.getElementById('ctl00_ctl00_CPContent_CPSidebar_ucLeagues2_ddlLeagues');
		var lgsDd_lgs = Foxtrick.getMBElement(doc, 'ucLeaguesDropdown_ddlLeagues');
		var ddlZone = Foxtrick.getMBElement(doc, 'ddlZone');

		var ddlBornIn = Foxtrick.getMBElement(doc, 'ddlBornIn');

		var action;
		if (Foxtrick.Prefs.isModuleOptionEnabled('CountryList', 'SelectBoxes')) {
			action = this._changelist;
		}
		else {
			action = this._activate;
		}

		var pageMap = {
			transferSearchForm: [[ddlZone, 10], [ddlBornIn, 1]],
			country: [lgsDd_lgs, 0],
			htPress: [lgs2_lgs, 1],
			statsTransfersBuyers: [lgs, 1],
			statsTeams: [lgs_lgs, 0],
			statsPlayers: [lgs_lgs, 0],
			statsRegions: [lgs_lgs, 0],
			statsNationalTeams: [lgs_lgs, 0],
			statsConfs: [lgs_lgs, 0],
			statsBookmarks: [lgs_lgs, 0],
			trainingStats: [lgs, 1],
			statsArena: [lgsDd_lgs, 0],
			helpContact: [lgsDd_lgs, 3],
		};

		for (var page in pageMap) {
			if (Foxtrick.isPage(doc, page)) {
				action.apply(this, pageMap[page]);
				break;
			}
		}

		if (Foxtrick.Prefs.isModuleOptionEnabled('CountryList', 'TeamPage')) {
			if (Foxtrick.isPage(doc, 'teamPage')) {
				this._placeCountry(doc);
			}
		}

		if (Foxtrick.Prefs.isModuleOptionEnabled('CountryList', 'ManagerPage')) {
			if (Foxtrick.isPage(doc, 'managerPage'))
				this._placeCountry(doc);
		}

	},

	_placeCountry: function(doc) {
		var cntr = doc.getElementById('ft_cntr_fix');
		if (!cntr) {
			var league = doc.getElementById('mainBody').getElementsByClassName('flag')[0];
			if (!league)
				return;
			if (Foxtrick.Prefs.isModuleOptionEnabled('CountryList', 'HideFlagOntop')) {
				league.setAttribute('style', 'display:none');
			}
			Foxtrick.log(league.href + '\n');
			var useEnglish = Foxtrick.Prefs.isModuleOptionEnabled('CountryList', 'UseEnglish');
			var leagueId = league.href.match(/LeagueID=(\d+)/i)[1];
			var info = Foxtrick.util.id.getLeagueDataFromId(leagueId);
			var newName = info[useEnglish ? 'EnglishName' : 'LeagueName'];
			if (!newName)
				return -1;
			league.firstChild.title = newName;

			var byline = doc.getElementsByClassName('byline')[0];
			var a = Foxtrick.createFeaturedElement(doc, Foxtrick.modules.CountryList, 'a');
			byline.insertBefore(a, byline.firstChild);
			a.id = 'ft_cntr_fix';
			a.href = league.href;
			a.textContent = newName;
			byline.insertBefore(doc.createTextNode(', '), a.nextSibling);
		}
	},

	_changelist: function(selectbox, start) {
		var module = this;
		if (!selectbox)
			return;

		if (Array.isArray(selectbox)) {
			// redirect multiple selects
			Foxtrick.map(function(args) {
				module._changelist.apply(module, args);
			}, arguments);
			return;
		}

		var id = selectbox.id;
		var useEnglish = Foxtrick.Prefs.isModuleOptionEnabled('CountryList', 'UseEnglish');
		Foxtrick.log('id: ' + id + '   start: ' + start + '\n');
		var options = selectbox.options;
		var countries = options.length;
		var id_sel = selectbox.value;
		for (var i = start; i < countries; i++) {
			var league;
			if (/leagues/i.test(id) || /zone/i.test(id)) {
				league = options[i].value;
			}
			else {
				league = Foxtrick.XMLData.getLeagueIdByCountryId(options[i].value);
			}
			var info = Foxtrick.util.id.getLeagueDataFromId(league);
			var newName = info[useEnglish ? 'EnglishName' : 'LeagueName'];
			if (!newName)
				return -1;
			options[i].text = newName;
		}
		Foxtrick.makeFeaturedElement(selectbox, Foxtrick.modules.CountryList);

		var opt_array = [];
		for (var i = start; i < options.length; i++) {
			var oldopt = ['-1', '-1'];
			oldopt[0] = options[i].value;
			oldopt[1] = options[i].text;
			opt_array.push(oldopt);
		}

		var sortByOptionText = function(a, b) {
			return a[1].localeCompare(b[1], 'sv');
		};

		opt_array.sort(sortByOptionText);
		for (var i = start; i < options.length; i++) {
			if (opt_array[i - start][0] == id_sel)
				selectbox.selectedIndex = i;
			options[i].value = opt_array[i - start][0];
			options[i].text = opt_array[i - start][1];
		}
		selectbox.style.display = 'inline';
	},

	_activate: function(selectbox) {
		var module = this;
		if (!selectbox)
			return;

		if (Array.isArray(selectbox)) {
			// redirect multiple selects
			Foxtrick.map(function(args) {
				module._activate.apply(module, args);
			}, arguments);
			return;
		}

		selectbox.style.display = 'inline';
		Foxtrick.log('country select activated.\n');
	}
};
