// TODO Consider to drop Bluebird use
const Promise = require('bluebird');

class TaskRunner {
    constructor() {
        this.currentTask = null;
        this.tasks = [];
        this.running = false;
    }

    // TODO Explore ability to remove the task
    add(task) {
        this.tasks.push(task);
        this.invalidate();
    }

    executeTask() {
        this.currentTask = this.tasks.shift();

        return Promise
            .resolve()
            .then(() => this.currentTask.run())
            .finally(() => {
                this.currentTask = null;
                return this.invalidate();
            })
    }

    invalidate() {
        if (this.isRunning() === true && this.currentTask === null && this.tasks.length > 0) {
            return this.executeTask();
        }
    }

    isRunning() {
        return this.running;
    }

    start() {
        this.running = true;
        return this.invalidate();
    }

    /**
     * Stops execution of the postponed tasks.
     * Note: the current task will not be interrupted and it will be completed regardless stop request
     */
    stop() {
        this.running = false;
    }

}

module.exports = TaskRunner;
