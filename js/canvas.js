function init() {
  window.canvas = document.getElementById("canvas");
  window.ctx = window.canvas.getContext("2d");
      
  window.canvas.addEventListener("mousemove", onMouseMove, true);
  window.canvas.addEventListener("mousedown", onMouseDown, true);
  window.canvas.addEventListener("mouseup", onMouseUp, true);

  window.mouseX = 0;
  window.mouseY = 0;

  window.ratios = [
    {width: 1, height: 48},
    {width: 2, height: 24},
    {width: 3, height: 16},
    {width: 4, height: 12},
    {width: 6, height: 8},
    {width: 8, height: 6},
    {width: 12, height: 4},
    {width: 16, height: 3},
    {width: 24, height: 2},
    {width: 48, height: 1},
  ].map(x => ({
    width: x.width,
    height: x.height,
    ratio: x.width / x.height
  }));

  updateDimensions();
}

function onMouseMove() {
  window.mouseX = window.event.pageX;
  window.mouseY = window.event.pageY;
}

function onMouseDown() {
}

function onMouseUp() {
}

function updateDimensions() {
  var width = window.canvas.getBoundingClientRect().width,
      height = window.canvas.getBoundingClientRect().height;
  window.wh_ratio = width / height;

  var lo = 0,
      hi = window.ratios.length - 1,
      mid;
  while (hi > lo + 1) {
    mid = Math.floor((hi + lo) / 2);
    if (window.wh_ratio > window.ratios[mid].ratio) lo = mid;
    else hi = mid;
  }

  var ratio;
  if (window.wh_ratio - window.ratios[lo].ratio < 
      window.ratios[hi].ratio - window.wh_ratio) ratio = window.ratios[lo];
  else ratio = window.ratios[hi];

  window.width = ratio.width;
  window.height = ratio.height;
  window.canvas.width = width;
  window.canvas.height = height;
  window.tile_width = width / (window.width + 2);
  window.tile_height = height / (window.height + 2);

  for (var i = 0; i < 48; i++)
    render_tile(i);
}

function render_tile(index) {
  var x = (index % window.width + 1) * window.tile_width,
      y = (Math.floor(index / window.width) + 1) * window.tile_height,
      min_dim = Math.min(window.tile_width, window.tile_height),
      r = min_dim / 10,
      margin = min_dim / 20;

  window.ctx.beginPath();
  window.ctx.strokeStyle="black";
  window.ctx.moveTo(x + r + margin, y + margin);
  window.ctx.lineTo(x + window.tile_width - r - margin, y + margin);
  window.ctx.quadraticCurveTo(
    x + window.tile_width - margin,
    y + margin,
    x + window.tile_width - margin,
    y + r + margin
  );
  window.ctx.lineTo(x + window.tile_width - margin, y + window.tile_height - r - margin);
  window.ctx.quadraticCurveTo(
    x + window.tile_width - margin,
    y + window.tile_height - margin,
    x + window.tile_width - r - margin,
    y + window.tile_height - margin
  );
  window.ctx.lineTo(x + r + margin, y + window.tile_height - margin);
  window.ctx.quadraticCurveTo(
    x + margin,
    y + window.tile_height - margin,
    x + margin,
    y + window.tile_height - r - margin
  );
  window.ctx.lineTo(x + margin, y + r + margin);
  window.ctx.quadraticCurveTo(x + margin, y + margin, x + r + margin, y + margin);
  window.ctx.stroke();
}
