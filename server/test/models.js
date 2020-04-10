const expect = require('chai').expect;

describe('Db should include all required model', () => {
  it('1.should include awardDetail', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('awardDetail');
    done();
  });

  it('2.should include user', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('user');
    done();
  });
  it('3.should include voter', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('voter');
    done();
  });

  it('4.should include nominee', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('nominee');
    done();
  });

  it('5.should include breakdown', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('votingBreakdown');
    done();
  });

  it('6.should include role', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('role');
    done();
  });

  it('7.should include team', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('team');
    done();
  });

  it('8.should include winner', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('finalResult');
    done();
  });

  it('9.should include award type', done => {
    const db = require('../models');
    expect(db).hasOwnProperty('awardType');
    done();
  });

});
