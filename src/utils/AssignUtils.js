module.exports = function(to, from) {
  Object.keys(from).forEach(function(key) {
    to[key] = from[key];
  });
};
