class CustomEvent {
    type = null;

    constructor(eventName, eventInitDict) {
        this.type = eventName;

        if (eventInitDict) {
            Object.keys(eventInitDict).forEach(key => {
                this[key] = eventInitDict[key];
            });
        }
    }
}

global.CustomEvent = CustomEvent;