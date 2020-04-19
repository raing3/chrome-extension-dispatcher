import {createDispatcher, CommunicatorType} from '@rainger/chrome-extension-dispatcher';

// create dispatcher to communicate with content.ts
const dispatcher = createDispatcher({
    destination: {
        type: CommunicatorType.Event,
        channel: 'extensionDispatcherDemoEntry',
        on: window
    }
});

// expose "getTabs" function handled in background.ts
(window as any).extensionDispatcherDemo = {
    getTabs: dispatcher.createProxyFunction('getTabs')
};