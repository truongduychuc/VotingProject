async function asyncForEach(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError('Invalid input array');
  }
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}
module.exports = {
  asyncForEach
};
