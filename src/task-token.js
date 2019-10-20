const Promise = require('bluebird');

class TaskToken {
    /**
     * Extra level of abstraction on top of the Promise.
     */
    constructor() {
        this.promise = Promise.resolve();
        this.resolve = () => undefined;
        this.reject = () => undefined;
    }

    getPromise() {
        return this.promise;
    }

    complete() {
        this.resolve();
    }

    failWithError(error) {
        this.reject(error);
    }

    init() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });

        return this;
    }
}

module.exports = TaskToken;
