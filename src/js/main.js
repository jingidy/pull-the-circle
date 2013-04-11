$(function () {
  // Globals
  var ticks = [];
  var tickCount = 100;

  var circle = $('#circle');
  var diameter = circle.width();
  var radius = diameter / 2;
  var originX = null;
  var originY = null;
  var originNeedsUpdate = true;

  var maxDist = 500;
  var lastUpdatedX = null;
  var lastUpdatedY = null;
  var lastUpdatedDist = null;

  var maxHeightRatio = 2;
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

  function distance(x1, y1, x2, y2) {
    var x = x1 - x2;
    var y = y1 - y2;
    return Math.sqrt(x * x + y * y);
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
    var amountToDistort = 1 - ratioFromLongest;

    var scale;
    if (lastUpdatedDist > radius)
      scale = 1 + amountToDistort * maxHeightRatio * (lastUpdatedDist - radius) / (500 - radius);
    else
      scale = Math.max(minHeightRatio, 1 - amountToDistort * (radius - lastUpdatedDist)/radius);
    ticks[index].css('-webkit-transform', 'translateX(' + scale * 50 + 'px) scaleX(' + scale + ')');
  }

  function updateOrigin() {
    var offset = circle.offset();
    originX = offset.left + diameter/2;
    originY = offset.top + diameter/2;
    originNeedsUpdate = false;
  }

  function updateTicks (e) {
    var x = e.pageX;
    var y = e.pageY;

    // Bail if not diff enough
    if (Math.abs(x - lastUpdatedX) < 5 && Math.abs(y - lastUpdatedY) < 5)
      return;
    lastUpdatedX = x;
    lastUpdatedY = y;

    // Re-base to be offset from circle's origin
    if (originNeedsUpdate)
      updateOrigin();
    x = x - originX;
    y = y - originY;

    // Bigger dist = longer ticks
    lastUpdatedDist = Math.min(distance(x, y, 0, 0), maxDist);

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
      var color = 'hsl(' + (Math.random() * 256).toFixed(0) + ', 50%, ' + (Math.random() * 50 + 30).toFixed(0) + '%)';
      tick.css('background-color', color);
      ticks[i] = tick;
      container.append(tick);

      circle.append(container);
    }

    // Add event listeners
    $('body').on('mousemove', updateTicks);
    $(window).resize(function () {
      originNeedsUpdate = true;
    });
  }

  init();
});
