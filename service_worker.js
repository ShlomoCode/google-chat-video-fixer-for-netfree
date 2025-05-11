'use strict';
const rules = [
    {
        id: 1,
        priority: 1,
        action: {
            type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
            redirect: {
                regexSubstitution: 'https://chat.google.com/u/\\1/api/get_attachment_url?url_type=DOWNLOAD_URL&content_type=video\\2',
            },
        },
        condition: {
            regexFilter: '^https://chat.google.com/u/([0-9])/api/get_attachment_url[?]url_type=STREAMING_URL[&]content_type=video(.*)',
            resourceTypes: [chrome.declarativeNetRequest.ResourceType.MEDIA],
        },
    },
    {
        id: 2,
        priority: 1,
        action: {
            type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
            redirect: {
                regexSubstitution: chrome.runtime.getURL('player.html') + '?url=\\0',
            },
        },
        condition: {
            regexFilter: '^https://chat.google.com/u/([0-9])/api/get_attachment_url[?]url_type=DOWNLOAD_URL(.*)[&]content_type=video(.*)',
            resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
            initiatorDomains: ['chat.google.com', 'mail.google.com'],
        },
    },
    {
        id: 3,
        priority: 1,
        action: {
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            responseHeaders: [
                {
                    operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
                    header: 'Content-Security-Policy',
                },
                {
                    operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                    header: 'Cross-Origin-Resource-Policy',
                    value: 'cross-origin'
                },
                {
                    operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
                    header: 'Content-Disposition',
                },
            ],
        },
        condition: {
            urlFilter: 'https://chat.usercontent.google.com/download',
            resourceTypes: [chrome.declarativeNetRequest.ResourceType.MEDIA, chrome.declarativeNetRequest.ResourceType.SUB_FRAME],
        },
    },
];

chrome.declarativeNetRequest.getDynamicRules({}, async (existingRules) => {
    if (existingRules.length) {
       await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: existingRules.map((rule) => rule.id)
        });
    }
    
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
    });
});