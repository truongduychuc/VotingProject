const expect = require('chai').expect;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const loadMultiChainConfig = () => ({
  port: process.env.MULTICHAIN_PORT || 9228,
  host: process.env.MULTICHAIN_HOST || '127.0.0.1',
  user: process.env.MULTICHAIN_USER || 'multichainrpc',
  pass: process.env.MULTICHAIN_PASSWORD || '9sfodHXB9RJ41uSxhNGa1CXnHu7GF399PsuxWx5Zhnfo'
});

describe('Test connect to multichain', () => {
  it('should return status 200', done => {
    const config = loadMultiChainConfig();
    const payload = {
      method: "getblockchainparams",
      params: [],
      id: 1,
      jsonrpc: "2.0"
    };
    chai.request("http://localhost:" + config.port)
      .post('/')
      .auth(config.user, config.pass)
      .type('json')
      .send(JSON.stringify(payload)).end((err, res) => {
        expect(res).to.have.status(200);
        done();
    })

  });
});
