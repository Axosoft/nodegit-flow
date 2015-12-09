const Promise = require('nodegit-promise');

const promisify = function promisify(fn) {
  let resolve;
  let reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return function() {
    fn(...arguments, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
    return promise;
  };
};

module.exports = promisify;
