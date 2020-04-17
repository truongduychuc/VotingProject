module.exports = function (fileName = __filename, logger) {
  return {
    error: (text) => {
      logger.error(fileName + ': ' + text);
    },
    info: text => {
      logger.info(fileName + ': ' + text);
    }
  }
};
