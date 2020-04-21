const {awardDetail: Award} = require('./models');
const queue = require('./queue').awardCreatingQueue;

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  }
}
queue.getFailed().then(jobArr => {
 jobArr.forEach(job => {
   queue.process(job).then(() => {
    console.log('Success');
   }).catch(err => {
     console.log(err);
   });
 });
});


