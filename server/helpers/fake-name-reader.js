// read from file
const path = require('path');

const fs = require('fs');
/**
 * @param {string} filePath
 * @return {Array}
 * */
const readAndMapNameObjectsFromTextFile = filePath => {
  const cache = [];
  const fCache = [];
  const str = fs.readFileSync(filePath);
  // \r\n for CRLF
  // \n for LF
  const names = str.toString().trim().split("\n");
  return names.map((e, i) => {
    e = e.trim();
    const nameParts = e.split(" ");
    const firstName = nameParts[0];
    if (fCache.includes(firstName)) {
      return {};
    }
    fCache.push(firstName);
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    let englishName;
    if (nameParts.length > 2) {
      englishName = nameParts.slice(1, nameParts.length - 1).join(" ");
    } else {
      englishName = lastName;
    }
    // avoid duplicating english name
    if (cache.includes(englishName)) {
      return {};
    } else {
      cache.push(englishName);
    }
    return {
      username: firstName.toLowerCase(),
      firstName,
      englishName,
      lastName
    }
  }).filter(nameObj => nameObj.firstName)
};
module.exports = readAndMapNameObjectsFromTextFile;

