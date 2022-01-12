const COVERED = 1,
      UNCOVERED = 2,
      SOLVED = 3;

function init() {
  window.canvas = document.getElementById("canvas");
  window.ctx = window.canvas.getContext("2d");
      
  window.canvas.addEventListener("mousemove", onMouseMove, true);
  window.canvas.addEventListener("mouseup", onMouseUp, true);

  window.mouseX = 0;
  window.mouseY = 0;

  window.ratios = [
    {width: 3, height: 8},
    {width: 4, height: 6},
    {width: 6, height: 4},
    {width: 8, height: 3},
    {width: 12, height: 2},
    {width: 24, height: 1},
  ].map(x => ({
    width: x.width,
    height: x.height,
    ratio: (x.width + 1) / (x.height + 1)
  }));

  window.tileStates = new Array(24).fill(COVERED);
  window.tiles = Array.from({ length: 24 }, (_, i) =>
    ({ value: Math.floor(i / 2), order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .map(({ value: value }) => value);
  window.selection = new Array();

  window.solved = 0;
  window.currentScore = { moves: 0, time: 0, exists: true };
  window.bestT = { moves: 0, time: 0, exists: false };
  window.bestM = { moves: 0, time: 0, exists: false };

  updateDimensions();
}

function onMouseMove() {
  window.mouseX = window.event.pageX;
  window.mouseY = window.event.pageY;
}

function onMouseUp() {
  var index = getTileClicked();
  if (index < 0 || index >= 24 || window.tileStates[index] != COVERED) return;

  if (window.selection.length == 2) {
    for (const selection of window.selection) {
      window.tileStates[selection] = COVERED;
      renderTile(selection);
    }
    window.selection = new Array();
  }
  window.selection.push(index);
  window.tileStates[index] = UNCOVERED;
  renderTile(index);

  if (window.selection.length == 2) {
    var first = window.selection[0],
        second = window.selection[1];
    if (window.tiles[first] == window.tiles[second]) {
      window.tileStates[first] = SOLVED;
      window.tileStates[second] = SOLVED;
      renderTile(first);
      renderTile(second);
      window.solved++;
      window.selection = new Array();
    } else {
      window.tileStates[first] = COVERED;
      window.tileStates[second] = COVERED;
    }
    if (window.currentScore.moves == 0) {
      window.timeKeeper = window.setInterval(() => {
        window.currentScore.time++;
        renderMeta();
      }, 1000);
    }
    window.currentScore.moves++;
    if (window.solved >= 12) {
      window.clearInterval(window.timeKeeper);
    }
    renderMeta();
  }
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

  for (var i = 0; i < 24; i++)
    renderTile(i);
  renderMeta();
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
        shape = type % 4;
        color = Math.floor(type / 4);

    var cx = x + window.tileDim / 2,
        cy = y + window.tileDim / 2,
        r = window.tileDim / 4;
    shapeRender[shape](cx, cy, r, colors[color]);
  }
}

function renderStar(cx, cy, r, color) {
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
  window.ctx.fillStyle = color;
  window.ctx.fill();
  window.ctx.translate(-cx, -cy);
}

function renderTriangle(cx, cy, r, color) {
  window.ctx.translate(cx, cy);
  window.ctx.beginPath();
  window.ctx.moveTo(0, -r);
  for (var i = 0; i < 2; i++) {
    window.ctx.rotate(2 * Math.PI / 3);
    window.ctx.lineTo(0, -r);
  }
  window.ctx.rotate(2 * Math.PI / 3);
  window.ctx.closePath();
  window.ctx.fillStyle = color;
  window.ctx.fill();
  window.ctx.translate(-cx, -cy);
}

function renderCircle(cx, cy, r, color) {
  window.ctx.beginPath(); 
  window.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  window.ctx.fillStyle = color;
  window.ctx.fill();
}

function renderSquare(cx, cy, r, color) {
  window.ctx.beginPath();
  window.ctx.moveTo(cx - r, cy - r);
  window.ctx.lineTo(cx + r, cy - r);
  window.ctx.lineTo(cx + r, cy + r);
  window.ctx.lineTo(cx - r, cy + r);
  window.ctx.closePath();
  window.ctx.fillStyle = color;
  window.ctx.fill();
}

function renderMeta() {
  var margin = window.tileDim / 10,
      fontSize = window.tileDim / 6;
      bx = margin,
      by = window.canvas.height - margin,
      cx = margin,
      cy = fontSize + margin;
  var current = scoreToText(window.currentScore),
      bestM = "100|1000",
      bestT = "100|1999";

  window.ctx.clearRect(0, 0, window.canvas.width, window.offsetY);
  window.ctx.clearRect(
    0,
    window.canvas.height - window.offsetY,
    window.canvas.width,
    window.offsetY
  );

  window.ctx.font = fontSize + "px Courier New";
  window.ctx.fillStyle = "black";
  window.ctx.fillText("[current: " + current + "]", cx, cy);
  /*
  window.ctx.fillText(
    "[best(m): " + bestM + "] " + "[best(t): " + bestT + "]", bx, by);
  */
}

function scoreToText(score) {
  if (score.exists)
    return score.moves + "|" + score.time
  return "-"
}
