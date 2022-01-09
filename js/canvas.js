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
  ].map(x => ({width: x.width, height: x.height, ratio: x.width / x.height}));

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
  window.width = window.canvas.getBoundingClientRect().width;
  window.height = window.canvas.getBoundingClientRect().height;
  window.wh_ratio = window.width / window.height;
}
