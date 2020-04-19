require('dotenv').config();
const Queue = require('bull');
const queue = new Queue('myQueue');
const env = require('../helpers/env');

// test connection to azure redis cache
const testQueue = new Queue('testQueue', {
  redis: {
    host: env('REDIS_HOST') || '127.0.0.1',
    port: env('REDIS_PORT') || 6379,
    password: env('REDIS_PASSWORD') || 'YoOPkYJk0p7ZHiVSzOLoun64tMEYW4Y60MqTaHrlEm4=',
    tls: {
      servername: env('REDIS_HOST') || '127.0.0.1'
    }
  }
});

testQueue.add({data: 'Hello'});
testQueue.process(function (job, done) {
  console.log(job.data);
  done();
});
testQueue.on('completed', function () {
  console.log('Completed');
});

const awardCreatingQueue = new Queue('awardCreating');
module.exports = {
  queue,
  awardCreatingQueue
};
