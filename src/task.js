const Promise = require('bluebird');

const TaskToken = require('./task-token');

class Task {
    constructor(routine) {
        this.routine = routine;
        this.token = new TaskToken();

        return this.token.init().getPromise();
    }

    dispose() {
        this.routine = null;
        this.token = null;
    }

    run() {
        return Promise
            .resolve()
            // TODO Explore the possibility to respect Routine return value
            .then(() => this.routine())
            .then(() => this.token.complete())
            .catch(error => this.token.failWithError(error))
            .then(() => this.dispose())
    }
}

module.exports = Task;
