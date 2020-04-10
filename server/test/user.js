process.env.NODE_ENV='test';
const chai = require('chai');
const server = require('../server');
const should = chai.should();
chai.use(require('chai-http'));

describe('Unauthorized test', () => {
  it('should return 401 status', done => {
    chai.request(server)
      .get('/users/list')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      })
  });
});

describe('Authenticate test', () => {
  it('should return auth token', done => {
    chai.request(server)
      .post('/auth/authenticate')
      .send({
        username: 'admin',
        password: 'password'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.token.should.exist;
        done();
      })
  })
});

