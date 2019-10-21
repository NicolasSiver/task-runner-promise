const Promise = require('bluebird'),
      Sinon   = require('sinon');

const Task = require('../src/task');

describe('Task', () => {

    it('returns promise as a token', () => {
        expect(new Task(() => undefined).createToken()).to.be.instanceOf(Promise);
    });

    it('requires token creation', () => {
        expect(new Task().run()).to.be.rejected;
    });

    it('creates only one token', () => {
        let token;
        let task = new Task(() => undefined);

        task.createToken();
        token = task.token;
        task.createToken();

        expect(token === task.token).to.be.true;
    });


    it('executes provided routine', () => {
        let routine = Sinon.spy();
        let task = new Task(routine);

        task.createToken();

        return Promise
            .resolve()
            .then(() => task.run())
            .then(() => {
                expect(routine).to.have.been.calledOnce;
            });
    });

    it('assigns provided token', () => {
        let token = {getPromise: Sinon.spy(() => 88)};
        let task = new Task(() => undefined);

        expect(task.createToken(token)).to.be.equal(88);
    });

    it('captures successful routine execution', () => {
        let token = {complete: Sinon.spy(), getPromise: Sinon.spy()};
        let task = new Task(() => undefined);

        task.createToken(token);

        return Promise
            .resolve()
            .then(() => task.run())
            .then(() => {
                expect(token.complete).to.have.been.calledOnce;
            });
    });

    it('catches routine error execution', () => {
        let error = new Error('Unexpected Story');
        let token = {failWithError: Sinon.spy(), getPromise: Sinon.spy()};
        let task = new Task(() => {
            throw error;
        });

        task.createToken(token);

        return Promise
            .resolve()
            .then(() => task.run())
            .then(() => {
                expect(token.failWithError).to.have.been.calledWith(error);
            });
    });

});
