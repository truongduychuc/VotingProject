const Queue = require('bull');
const queue = new Queue('myQueue');
const awardCreatingQueue = new Queue('awardCreating');
module.exports = {
  queue,
  awardCreatingQueue
};
