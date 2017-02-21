module.exports =
  (callback) => (a) => Promise.resolve(callback()).then(() => a);
