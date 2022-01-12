const COVERED = 1,
      UNCOVERED = 2,
      SOLVED = 3;

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

  window.tileStates = new Array(48).fill(COVERED);
  window.tiles = Array.from({length: 48}, (_, i) =>
    ({ value: Math.floor(i / 2), order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ value: value }) => value);
  window.selection = new Array();

  updateDimensions();
}

function onMouseMove() {
  window.mouseX = window.event.pageX;
  window.mouseY = window.event.pageY;
}

function onMouseDown() {
}

function onMouseUp() {
  var index = getTileClicked();
  if (index < 0 || index >= 48 || window.tileStates[index] != COVERED) return;

  if (window.selection.length == 2) {
    for (const selection of window.selection) {
      window.tileStates[selection] = COVERED;
      renderTile(selection);
    }
    window.selection = new Array();
  }
  window.selection.push(index);
  window.tileStates[index] = UNCOVERED;

  if (window.selection.length == 2) {
    var first = window.selection[0],
        second = window.selection[1];
    if (window.tiles[first] == window.tiles[second]) {
      window.tileStates[first] = SOLVED;
      window.tileStates[second] = SOLVED;
      renderTile(first);
      window.selection = new Array();
    }
  }
  renderTile(index);
}

function getTileClicked() {
  var x = Math.floor((window.mouseX - window.offsetX) / window.tileDim),
      y = Math.floor((window.mouseY - window.offsetY) / window.tileDim);
  if (x < 0 || x >= window.width || y < 0 || y >= window.height) return -1;
  return x + y * window.width;
}

function updateDimensions() {
  var width = window.canvas.getBoundingClientRect().width,
      height = window.canvas.getBoundingClientRect().height,
      whRatio = width / height;

  var lo = 0,
      hi = window.ratios.length - 1,
      mid;
  while (hi > lo + 1) {
    mid = Math.floor((hi + lo) / 2);
    if (whRatio > window.ratios[mid].ratio) lo = mid;
    else hi = mid;
  }

  var ratio;
  if (whRatio - window.ratios[lo].ratio < 
      window.ratios[hi].ratio - whRatio) ratio = window.ratios[lo];
  else ratio = window.ratios[hi];

  window.width = ratio.width;
  window.height = ratio.height;
  window.canvas.width = width;
  window.canvas.height = height;
  window.tileDim = Math.min(
    width / (window.width + 1),
    height / (window.height + 1)
  );
  window.offsetX = (width - (window.width * window.tileDim)) / 2;
  window.offsetY = (height - (window.height * window.tileDim)) / 2;

  for (var i = 0; i < 48; i++)
    renderTile(i);
}

function renderTile(index) {
  var x = (index % window.width) * window.tileDim + window.offsetX,
      y = Math.floor(index / window.width) * window.tileDim + window.offsetY,
      r = window.tileDim / 20,
      margin = window.tileDim / 50;

  window.ctx.beginPath();
  window.ctx.lineWidth = 2;
  window.ctx.strokeStyle = "black";
  window.ctx.moveTo(x + r + margin, y + margin);
  window.ctx.lineTo(x + window.tileDim - r - margin, y + margin);
  window.ctx.quadraticCurveTo(
    x + window.tileDim - margin,
    y + margin,
    x + window.tileDim - margin,
    y + r + margin
  );
  window.ctx.lineTo(
    x + window.tileDim - margin,
    y + window.tileDim - r - margin
  );
  window.ctx.quadraticCurveTo(
    x + window.tileDim - margin,
    y + window.tileDim - margin,
    x + window.tileDim - r - margin,
    y + window.tileDim - margin
  );
  window.ctx.lineTo(x + r + margin, y + window.tileDim - margin);
  window.ctx.quadraticCurveTo(
    x + margin,
    y + window.tileDim - margin,
    x + margin,
    y + window.tileDim - r - margin
  );
  window.ctx.lineTo(x + margin, y + r + margin);
  window.ctx.quadraticCurveTo(
    x + margin, y + margin,
    x + r + margin, y + margin
  );
  window.ctx.stroke();

  if (window.tileStates[index] == SOLVED) window.ctx.fillStyle = "grey";
  else window.ctx.fillStyle = "white";
  window.ctx.fill();

  if (window.tileStates[index] != COVERED) {
    var shapeRender = [renderStar, renderTriangle, renderCircle, renderSquare],
        colors = ["orange", "blue", "red"];

    var type = window.tiles[index],
        fill = Boolean(type % 2),
        shape = Math.floor((type % 8) / 2),
        color = Math.floor(type / 8);

    var cx = x + window.tileDim / 2,
        cy = y + window.tileDim / 2,
        r = window.tileDim / 4,
        th = window.tileDim / 20;
    shapeRender[shape](cx, cy, r, th, colors[color], fill);
  }
}

function completeSymbol(th, color, fill) {
  if (fill) {
    window.ctx.fillStyle = color;
    window.ctx.fill();
  } else {
    window.ctx.lineWidth = th;
    window.ctx.strokeStyle = color;
    window.ctx.stroke();
  }
}

function renderStar(cx, cy, r, th, color, fill) {
  window.ctx.translate(cx, cy);
  window.ctx.beginPath();
  window.ctx.moveTo(0, -r);
  for (var i = 0; i < 5; i++) {
    window.ctx.rotate(Math.PI / 5);
    window.ctx.lineTo(0, -(r / 2));
    window.ctx.rotate(Math.PI / 5);
    window.ctx.lineTo(0, -r);
  }
  window.ctx.closePath();
  completeSymbol(th, color, fill)
  window.ctx.translate(-cx, -cy);
}

function renderTriangle(cx, cy, r, th, color, fill) {
  window.ctx.translate(cx, cy);
  window.ctx.beginPath();
  window.ctx.moveTo(0, -r);
  for (var i = 0; i < 2; i++) {
    window.ctx.rotate(2 * Math.PI / 3);
    window.ctx.lineTo(0, -r);
  }
  window.ctx.rotate(2 * Math.PI / 3);
  window.ctx.closePath();
  completeSymbol(th, color, fill)
  window.ctx.translate(-cx, -cy);
}

function renderCircle(cx, cy, r, th, color, fill) {
  window.ctx.beginPath(); 
  window.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  completeSymbol(th, color, fill)
}

function renderSquare(cx, cy, r, th, color, fill) {
  window.ctx.beginPath();
  window.ctx.moveTo(cx - r, cy - r);
  window.ctx.lineTo(cx + r, cy - r);
  window.ctx.lineTo(cx + r, cy + r);
  window.ctx.lineTo(cx - r, cy + r);
  window.ctx.closePath();
  completeSymbol(th, color, fill)
}
