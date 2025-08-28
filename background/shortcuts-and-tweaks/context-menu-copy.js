/**
 * context-menu-copy.js
 * Options at the context menu for copying ID and/or link and content in HT-ML
 * @author LA-MJ, convinced, ryanli
 */

'use strict';

const ContextMenuCopy = {
    handler: async function(request) {
        const documentUrlPatterns = [
            '*://*.hattrick.org/*',
        ];

        // removeAll is only Promisified in chrome 123+
        await new Promise(resolve => chrome.contextMenus.removeAll(resolve));

        // add new entries
        for (let type in request.entries) {
            let source = request.entries[type];

            chrome.contextMenus.create({
                id: type,
                title: source.title,
                contexts: ['all'],
                documentUrlPatterns,
            });
            chrome.contextMenus.onClicked.addListener(async (info, tab) => {
                if (tab && tab.id != null)
                    chrome.tabs.sendMessage(tab.id, { type: 'ft-context-menu-copy', menuId: info.menuItemId });
            });

        }
    }
}

export {ContextMenuCopy};