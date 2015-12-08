const noOpProperties = [
  'arguments',
  'caller',
  'callee'
];

module.exports = function(to, from) {
  Object.getOwnPropertyNames(from).forEach((key) => {
    if (!~noOpProperties.indexOf(key) && typeof from[key] === 'function') {
      to[key] = from[key];
    }
  });
};
