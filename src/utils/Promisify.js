const promisify = function promisify(fn) {
  return function() {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });

    fn(...arguments, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
    return promise;
  };
};

module.exports = promisify;
