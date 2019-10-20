const Chai           = require('chai'),
      ChaiAsPromised = require('chai-as-promised'),
      SinonChai      = require('sinon-chai');

Chai.use(ChaiAsPromised());
Chai.use(SinonChai);
