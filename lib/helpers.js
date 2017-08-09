module.exports = {
  viewHours: function (difference){
    difference = difference * 0.001; //convert milliseconds to seconds
    difference = difference * 0.0166667; //convert seconds to minutes
    difference = difference * 0.0166667; //convert minutes to hours
    if (difference > 10000){
      difference = Math.floor(difference);
    }
    return difference.toFixed(3);
  },
  goalPercent: function(time, goalTime) {
    var percentage = time / goalTime;
    percentage = percentage * 100;
    return percentage.toFixed(0);
  }
}
