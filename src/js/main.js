$(function () {
  // Globals
  var ticks = [];
  var tickCount = 4;

  var circle = $('#circle');
  var diameter = circle.width();

  var maxHeightRatio = 1;
  var minHeightRatio = 0.1;

  // Functions
  function cartesian2radian(x, y) {
    var angle = Math.atan(Math.abs(y/x));

    if (x < 0 && y >= 0) // Quad 2
      angle = Math.PI - angle;
    else if (x < 0 && y < 0) // Quad 3
      angle += Math.PI;
    else if (x >= 0 && y < 0) // Quad 4
      angle = 2 * Math.PI - angle;
    // Do nothing for quad 1.
    return angle;
  }

  function radian2tickNum(rad) {
    var ratio = rad/(2*Math.PI);
    var tickNum = (ratio * tickCount).toFixed(1);
    return tickNum;
  }

  function updateTickHeight(index, longestTickNum) {
    // Tick closest to the longestTickNum is the highest,
    // while the tick across from longestTickNum is the shortest.
    var halfCount = tickCount / 2;
    var distToLongest = Math.abs(index - longestTickNum);
    var minDistToLongest = Math.min(distToLongest, tickCount - distToLongest);
    var ratioFromLongest = minDistToLongest / halfCount;
    var scale = (1 - ratioFromLongest) * (maxHeightRatio - minHeightRatio) + minHeightRatio;
    ticks[index].css('-webkit-transform', 'scaleX(' + scale + ')');
  }

  function updateTicks (e) {
    var x = e.pageX;
    var y = e.pageY;

    // Re-base to be offset from circle's origin
    var offset = circle.offset();
    var originX = offset.left + diameter/2;
    var originY = offset.top + diameter/2;
    x = x - originX;
    y = y - originY;

    // Find the longest tick
    var longest = radian2tickNum(cartesian2radian(x, y));
    for (var i = 0; i < tickCount; i++)
      updateTickHeight(i, longest);
  }

  function init () {
    // Generate ticks
    for (var i = 0; i < tickCount; i++) {
      var angle = (i / tickCount * 360).toFixed(2);

      var container = $('<div>').addClass('tickContainer');
      container.css('-webkit-transform', 'rotate(' + angle + 'deg)');

      var tick = $('<div>').addClass('tick');
      ticks[i] = tick;
      container.append(tick);

      circle.append(container);
    }

    // Add event listeners
    $('body').on('click', updateTicks);
  }

  init();
});
