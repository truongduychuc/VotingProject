process.env.NODE_ENV = 'test';
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const should = chai.should();
chai.use(require('chai-http'));
const winston = require('../config/winston');
const logger = require('../helpers/logging')(__filename, winston);
const {
  awardDetail: Award,
  finalResult: Winner,
  nominee: Nominee,
  role: Role,
  voter: Voter,
  votingBreakdown: Breakdown,
  awardType: AwardType,
} = require('../models');


describe('Create award test', () => {
  it('should return 401 status', done => {
    chai.request(server)
      .get('/awards/create')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.message.should.equal('No token provided.');
        done();
      })
  });

  it('should return 422 status', done => {
    const agent = chai.request.agent(server);
    agent.post('/auth/authenticate')
      .send({username: 'admin', password: 'password'})
      .end((err, res) => {
        return agent
          .post('/awards/create')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + res.body.token)
          .end((e, r) => {
            r.should.have.status(422);
            done();
          })
      })
  });

  it('should return a new award', function (done) {
    const agent = chai.request.agent(server);
    agent.post('/auth/authenticate')
      .send({username: 'admin', password: 'password'})
      .end((err, res) => {
        return agent
          .post('/awards/create')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer ' + res.body.token)
          .send({
            type: 1,
            year: 2020,
            date_start: (new Date()),
            date_end: (new Date(2020, 3, 22)),
            id_role_voter: [2],
            prize: 250000,
            id_nominee: [5, 6, 7, 8, 9]
          })
          .end((e, r) => {
            r.should.have.status(200);
            console.log(e);
            console.log(r.body);
            done();
          })
      })
  });
  // after(function () {
  //   Breakdown.destroy({where: {}}).then(() => {
  //     Promise.all([
  //       Nominee.destroy({where: {}}),
  //       Voter.destroy({where: {}}),
  //       Winner.destroy({where: {}}),
  //       Breakdown.destroy({where: {}}),
  //     ]).then(r => {
  //       Award.destroy({where: {}}).then(ss => {
  //         console.log('Cleared db')
  //       });
  //     })
  //   })
  // })
});
