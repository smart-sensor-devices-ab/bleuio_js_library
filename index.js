/* function randomNoGenerator(min, max) {
  if(typeof(max) !== 'number' && typeof(min) !== 'number') {
    min = 0;  max = 1;
  }
 return (Math.random() * (max-min)) + min;
}
module.exports = randomNoGenerator; */

exports.ati = function() {
  return 'device information'
};
exports.at_connect = function() {
  return 'device connected'
};
exports.at_disconnect = function() {
  return 'device disconnected'
};