const Promise = require('bluebird'),
      Sinon   = require('sinon');

const TaskRunner = require('../src/task-runner');

describe('Task Runner', () => {
    let runner;

    beforeEach(() => {
        runner = new TaskRunner();
    });

    afterEach(() => {
        runner = null;
    });

    it('adds tasks', () => {
        runner.add({});
        runner.add({});
        runner.add({});

        expect(runner.tasks).to.be.lengthOf(3);
    });

    it('provides state for task running', () => {
        runner.start();
        expect(runner.isRunning()).to.be.true;
    });

    it('stops execution', () => {
        runner.start();
        runner.stop();
        expect(runner.isRunning()).to.be.false;
    });

    it('runs task when active', () => {
        let task = {run: Sinon.spy()};

        runner.add(task);
        runner.start();

        expect(runner.tasks).to.be.empty;
    });

    it('runs tasks as a queue', () => {
        let task1 = {run: Sinon.spy()};
        let task2 = {run: Sinon.spy()};
        let task3 = {run: Sinon.spy()};

        runner.add(task1);
        runner.add(task2);
        runner.add(task3);

        return Promise
            .resolve()
            .then(() => runner.start())
            .then(() => {
                expect(runner.tasks).to.be.empty;
                expect(task2.run).to.be.calledAfter(task1.run);
                expect(task3.run).to.be.calledAfter(task2.run);
            });
    });

    it('runs tasks which would contain errors', () => {
        let task1 = {
            run: () => {
                throw new Error('Task 1 is broken');
            }
        };
        let task2 = {run: () => Promise.reject('Not today!')};
        let task3 = {run: Sinon.spy()};

        runner.add(task1);
        runner.add(task2);
        runner.add(task3);

        return Promise
            .resolve()
            .then(() => runner.start())
            .then(() => {
                expect(runner.tasks).to.be.empty;
                expect(task3.run).to.be.calledOnce;
            })
    });

});
