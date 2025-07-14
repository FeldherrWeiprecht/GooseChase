var cursor = document.getElementById("custom-cursor");

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
