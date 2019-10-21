const Promise = require('bluebird');

const TaskToken = require('./task-token');

class Task {
    constructor(routine) {
        this.routine = routine;
        this.token = null;
    }

    /**
     * Create a token for the task.
     * Every task should be accompanied by a token to handle different lifecycle states.
     * To prevent potential bugs, the task can have only one token and multiple invocations of
     * this method will make sure that token is not re-created.
     *
     * @param {TaskToken} initToken initial token, the token should be initialized
     * @returns {Promise}
     */
    createToken(initToken = null) {
        if (this.token === null) {
            if (initToken === null) {
                this.token = new TaskToken();
                this.token.init();
            } else {
                this.token = initToken;
            }
        }

        return this.token.getPromise();
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
