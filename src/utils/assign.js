module.export = function assign(to, from) {
  Object.keys(from).forEach(function(key) {
    to[key] = from[key];
  });
}
