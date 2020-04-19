import {createResponder, CommunicatorType} from '@rainger/chrome-extension-dispatcher';

const getTabs = () => {
    return new Promise(resolve => {
        chrome.tabs.query({}, tabs => {
            resolve(tabs.map(tab => ({
                title: tab.title!,
                url: tab.url!,
            })))
        });
    });
};

// handle requests forwarded from content.ts
createResponder({
    source: {
        type: CommunicatorType.Message,
        channel: 'extensionDispatcherDemoDestination'
    },
    handlers: { getTabs }
});