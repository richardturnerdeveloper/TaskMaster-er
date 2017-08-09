const rp = require('request-promise');

var myCoords = {};
myCoords.lat = 37.5686940;
myCoords.lng = -84.2963220;

function asyncDayLight(){
  return new Promise(
    function(resolve, reject){
      rp(`https://api.sunrise-sunset.org/json?lat=${myCoords.lat}&lng=${myCoords.lng}&date=today`)
      .then((res) => {
        var responseObj = JSON.parse(res);
        resolve(responseObj.results.day_length);
      })
      .catch((e) => {
        reject(e);
      });
    }
  )
}

module.exports = {
  asyncDayLight
}
























rp(`https://api.sunrise-sunset.org/json?lat=${myCoords.lat}&lng=${myCoords.lng}&date=today`)
.then((res) => {
  var responseObj = JSON.parse(res);
  var result = responseObj.results.day_length;
  placeholder = result;
  return placeholder;
})
.catch((e) => {
  console.log(e);
});
