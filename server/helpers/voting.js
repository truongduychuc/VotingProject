/** @param {number} firstVotes
 * @param {number} secondVotes
 * @param {number} thirdVotes
 * @return {number}
 * */
const getTotalPoints = (firstVotes, secondVotes, thirdVotes) => Number(firstVotes) * 5 + Number(secondVotes) * 3 + Number(thirdVotes);

const sanitilizeVoteScores = (nominee) => {
  ["first_votes", "second_votes", "third_votes", "total_points"].forEach(flag => {
    nominee[flag] = Number(nominee[flag]);
  });
  return nominee;
};

/**
 * @param {Object} nominee1
 * @param {Object} nominee2
 * @param {Array} compareProps
 * @return {number} -1 | 0 | 1
 * */
const nomineeComparator = (
  nominee1,
  nominee2,
  compareProps = [
    "total_points",
    "first_votes",
    "second_votes",
    "third_votes"
  ]) => {
  for (let prop of compareProps) {
    if (nominee2[prop] !== nominee1[prop]) {
      return nominee2[prop] - nominee1[prop];
    }
  }
  // 0 equal to no swap action happening
  return 0;
};
const getPercent = (points, total) => {
  if (points === 0) {
    return 0;
  }
  return parseFloat(((Number(points) / Number(total)) * 100).toFixed(2));
};
/**
 * Check if a nominee should have a higher rank than the later
 * a nominee essentially is a breakdown record
 * sort from the highest to lowest
 * the lower the score a nominee has, the higher number of rank he/she will get
 * */
const shouldSwap = (firstNominee, secondNominee) => {
  firstNominee = sanitilizeVoteScores(firstNominee);
  secondNominee = sanitilizeVoteScores(secondNominee);
  return nomineeComparator(firstNominee, secondNominee);
};

module.exports = {
  nomineeComparator,
  shouldSwap,
  getPercent,
  getTotalPoints
};
