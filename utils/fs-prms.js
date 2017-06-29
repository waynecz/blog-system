const fs = require('fs');
const {promisify} = require('util');

const readDirPrms = promisify(fs.readdir);

const readFilePrms = promisify(fs.readFile);

const writeFilePrms = promisify(fs.writeFile);

const delFilePrms = promisify(fs.unlink);

module.exports = {
  readDirPrms,
  readFilePrms,
  writeFilePrms,
  delFilePrms
};