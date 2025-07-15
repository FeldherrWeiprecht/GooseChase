var cursor = document.getElementById("custom-cursor");
var goose = document.getElementById("goose");

var netWidth = 128;
var netHeight = 128;
var offsetX = netWidth / 2;
var offsetY = netHeight / 2;

var mouseX = 0;
var mouseY = 0;

document.addEventListener("mousemove", function(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  var left = mouseX;
  var top = mouseY;

  cursor.style.left = left + "px";
  cursor.style.top = top + "px";
  cursor.style.display = "block";
});

document.addEventListener("mouseenter", function() {
  cursor.style.display = "block";
});

document.addEventListener("mouseleave", function() {
  cursor.style.display = "none";
});

var spawnMargin = 300;

function getRandomPosition(maxWidth, maxHeight) {
  var x = Math.random() * (window.innerWidth - maxWidth - spawnMargin * 2) + spawnMargin;
  var y = Math.random() * (window.innerHeight - maxHeight - spawnMargin * 2) + spawnMargin;

  return {
    x: Math.floor(x),
    y: Math.floor(y)
  };
}

function showGoose() {
  var width = goose.offsetWidth;
  var height = goose.offsetHeight;

  var position = getRandomPosition(width, height);

  goose.style.left = position.x + "px";
  goose.style.top = position.y + "px";
  goose.style.display = "block";
}

window.onload = function() {
  showGoose();
};
