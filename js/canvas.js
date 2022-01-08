function init() {
  window.canvas = document.getElementById("canvas");
  window.ctx = window.canvas.getContext("2d");
      
  window.canvas.addEventListener("mousemove", onMouseMove, true);
  window.canvas.addEventListener("mousedown", onMouseDown, true);

  updateDimensions();
}

function onMouseMove() {
}

function onMouseDown() {
}

function updateDimensions() {
  window.width = window.canvas.getBoundingClientRect().width;
  window.height = window.canvas.getBoundingClientRect().height;
}
