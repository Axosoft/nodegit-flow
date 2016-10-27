const path = require('path');
const fs = require('fs');

function FolderLoader(absoluteFolder, onto, replace) {
  if (!replace) {
    replace = '';
  }
  const relative = path.relative(__dirname, absoluteFolder);
  fs.readdirSync(absoluteFolder).forEach((file) => {
    const fileStats = fs.lstatSync(path.join(absoluteFolder, file));

    // don't recurse down directories
    if (!(/index\.js$/).test(file) && (/.*?\.js$/).test(file) && !fileStats.isDirectory()) {
      onto[file.replace(replace, '')] = require('./' + relative + '/' + file);
    }
  });
}
module.exports = FolderLoader;
