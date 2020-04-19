# Chrome Extension Dispatcher

## Install

Run the following in your project directory:

```
npm install @raing3/chrome-extension-dispatcher
```

## Concepts

### Dispatchers

Dispatchers are the entry point for calling a function that is exposed in another execution scope.

### Responders

Responders handle requests sent from a connected dispatcher, call any necessary logic and return the resulting value.

### Forwarders

Forwarders act as an intermediary between dispatchers and responders when calling a function needs to be bounced through multiple execution scopes.

## Demo

A demo can be found inside of the `demo` folder by launching the demo.html file located in the folder and following the instructions.

The demo extension has 3 different scopes of execution, these are:

#### background.js

This script registers a message responder which handles requests from `content-external.js`.

#### content.js

This script performs the following:

 * It injects the `content-external.js` script into the page content to enable access of the same `window` variable as the page (allowing functionality to be exposed to the page).
 * It registers a forwarder which:
   1. Accepts requests from `content-external.js` via a dispatched event on the window.
   2. Forwards those requests to `background.js` via the shared message connection.
   3. Returns the response from `background.js` back to `content-external.js`.

#### content-external

This script registers an event dispatcher which makes functionality exposed by `background.js` accessible to the loaded page.