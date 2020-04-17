const expect = require('chai').expect;

describe('Db should include all required model', () => {
  it('1.should include awardDetail', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('awardDetail');
    expect(db['awardDetail']).to.not.be.null;
    expect(db['awardDetail']).to.not.be.undefined;
    done();
  });

  it('2.should include user', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('user');
    expect(db['user']).to.not.be.null;
    expect(db['user']).to.not.be.undefined;
    done();
  });
  it('3.should include voter', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('voter');
    expect(db['voter']).to.not.be.null;
    expect(db['voter']).to.not.be.undefined;
    done();
  });

  it('4.should include nominee', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('nominee');
    expect(db['nominee']).to.not.be.null;
    expect(db['nominee']).to.not.be.undefined;
    done();
  });

  it('5.should include breakdown', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('votingBreakdown');
    expect(db['votingBreakdown']).to.not.be.null;
    expect(db['votingBreakdown']).to.not.be.undefined;
    done();
  });

  it('6.should include role', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('role');
    expect(db['role']).to.not.be.null;
    expect(db['role']).to.not.be.undefined;
    done();
  });

  it('7.should include team', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('team');
    expect(db['team']).to.not.be.null;
    expect(db['team']).to.not.be.undefined;
    done();
  });

  it('8.should include winner', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('finalResult');
    expect(db['finalResult']).to.not.be.null;
    expect(db['finalResult']).to.not.be.undefined;
    done();
  });

  it('9.should include award type', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('awardType');
    expect(db['awardType']).to.not.be.null;
    expect(db['awardType']).to.not.be.undefined;
    done();
  });

});
