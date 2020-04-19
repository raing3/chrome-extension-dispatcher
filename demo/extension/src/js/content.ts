import {createForwarder, CommunicatorType} from '@rainger/chrome-extension-dispatcher';

const injectScript = async (path: string) => {
    const script = document.createElement('script');

    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.runtime.getURL(path));

    (document.head || document.documentElement).appendChild(script);
};


// forward requests coming from content-external.ts to background.ts
createForwarder({
    source: {
        type: CommunicatorType.Event,
        channel: 'extensionDispatcherDemoEntry',
        on: window
    },
    destination: {
        type: CommunicatorType.Message,
        channel: 'extensionDispatcherDemoDestination'
    }
});

injectScript('js/content-external.js');