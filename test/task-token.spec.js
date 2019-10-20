const TaskToken = require('../src/task-token');

describe('Task Token', () => {
    let token;

    beforeEach(() => {
        token = new TaskToken();
        token.init();
    });

    it('constructed with the resolved promise', () => {
        expect(new TaskToken().getPromise()).to.be.fulfilled;
    });

    it('returns instance', () => {
        let currentToken = new TaskToken();
        expect(currentToken === currentToken.init()).to.be.true;
    });

    it('enters waiting state by default', () => {
        let triggered = false;

        setTimeout(() => {
            triggered = true;
            token.complete();
        }, 20);

        return token
            .getPromise()
            .then(() => {
                expect(triggered).to.be.true;
            });
    });

    it('completes', () => {
        token.complete();
        expect(token.getPromise()).to.be.fulfilled;
    });

    it('fails with the error', () => {
        let error = new Error('Generic Error');
        token.failWithError(error);
        expect(token.getPromise()).to.be.rejectedWith(error);
    });

});
