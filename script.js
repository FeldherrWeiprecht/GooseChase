var cursor = document.getElementById("custom-cursor");
var goose = document.getElementById("goose");
var corners = document.querySelectorAll(".corner");
var startScreen = document.getElementById("start-screen");
var startButton = document.getElementById("start-button");

var netWidth = 128;
var netHeight = 128;
var offsetX = netWidth / 2;
var offsetY = netHeight / 2;

var mouseX = 0;
var mouseY = 0;

var safeDistance = 100;
var moveDistance = 60;
var spawnMargin = 150;

var gameStarted = false;

document.addEventListener("mousemove", function(event) {
  if (gameStarted === false) {
    return;
  }

  mouseX = event.clientX;
  mouseY = event.clientY;

  var left = mouseX;
  var top = mouseY;

  cursor.style.left = left + "px";
  cursor.style.top = top + "px";
  cursor.style.display = "block";
});

document.addEventListener("mouseenter", function() {
  if (gameStarted === false) {
    return;
  }

  cursor.style.display = "block";
});

document.addEventListener("mouseleave", function() {
  if (gameStarted === false) {
    return;
  }

  cursor.style.display = "none";
});

function isInCorner(x, y, width, height) {
  var cornerSize = 150;

  var right = window.innerWidth - width;
  var bottom = window.innerHeight - height;

  var inTopLeft = x < cornerSize && y < cornerSize;
  var inBottomLeft = x < cornerSize && y > bottom - cornerSize;
  var inTopRight = x > right - cornerSize && y < cornerSize;
  var inBottomRight = x > right - cornerSize && y > bottom - cornerSize;

  if (inTopLeft) {
    return true;
  }

  if (inBottomLeft) {
    return true;
  }

  if (inTopRight) {
    return true;
  }

  if (inBottomRight) {
    return true;
  }

  return false;
}

function isTouchingAnyCorner(gooseRect) {
  var i = 0;

  while (i < corners.length) {
    var cornerRect = corners[i].getBoundingClientRect();

    var shrink = 120;

    var left = cornerRect.left + shrink;
    var top = cornerRect.top + shrink;
    var right = cornerRect.right - shrink;
    var bottom = cornerRect.bottom - shrink;

    var overlap = gooseRect.right > left && gooseRect.left < right && gooseRect.bottom > top && gooseRect.top < bottom;

    if (overlap) {
      return true;
    }

    i = i + 1;
  }

  return false;
}

function getRandomPosition(maxWidth, maxHeight) {
  var x = 0;
  var y = 0;
  var dx = 0;
  var dy = 0;
  var distance = 0;

  var minX = spawnMargin;
  var minY = spawnMargin;

  var maxX = window.innerWidth - maxWidth - spawnMargin;
  var maxY = window.innerHeight - maxHeight - spawnMargin;

  var valid = false;

  while (valid === false) {
    x = Math.random() * (maxX - minX) + minX;
    y = Math.random() * (maxY - minY) + minY;

    dx = x - mouseX;
    dy = y - mouseY;
    distance = Math.sqrt(dx * dx + dy * dy);

    if (isInCorner(x, y, maxWidth, maxHeight) === false && distance >= safeDistance) {
      valid = true;
    }
  }

  var result = {
    x: Math.floor(x),
    y: Math.floor(y)
  };

  return result;
}

function showGoose() {
  var width = goose.offsetWidth;
  var height = goose.offsetHeight;

  if (width === 0) {
    width = 150;
  }

  if (height === 0) {
    height = 150;
  }

  var position = getRandomPosition(width, height);

  goose.style.left = position.x + "px";
  goose.style.top = position.y + "px";
  goose.style.display = "block";
}

function moveGooseIfTooClose() {
  var gooseRect = goose.getBoundingClientRect();
  var cursorRect = cursor.getBoundingClientRect();

  var gooseCenterX = gooseRect.left + gooseRect.width / 2;
  var gooseCenterY = gooseRect.top + gooseRect.height / 2;

  var cursorCenterX = cursorRect.left + cursorRect.width / 2;
  var cursorCenterY = cursorRect.top + cursorRect.height / 2;

  var dx = gooseCenterX - cursorCenterX;
  var dy = gooseCenterY - cursorCenterY;
  var distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < safeDistance) {
    var moveX = (dx / distance) * moveDistance;
    var moveY = (dy / distance) * moveDistance;

    var newLeft = goose.offsetLeft + moveX;
    var newTop = goose.offsetTop + moveY;

    if (newLeft < 0) {
      newLeft = 0;
    }

    if (newLeft > window.innerWidth - goose.offsetWidth) {
      newLeft = window.innerWidth - goose.offsetWidth;
    }

    if (newTop < 0) {
      newTop = 0;
    }

    if (newTop > window.innerHeight - goose.offsetHeight) {
      newTop = window.innerHeight - goose.offsetHeight;
    }

    var direction = "left";

    if (moveX > 0) {
      direction = "right";
    }

    var idleImage = "url('assets/goose_idle_" + direction + ".png')";
    var walkImage = "url('assets/goose_walk_" + direction + ".png')";

    goose.style.left = newLeft + "px";
    goose.style.top = newTop + "px";
    goose.style.backgroundImage = walkImage;

    clearTimeout(goose.walkTimeout1);
    clearTimeout(goose.walkTimeout2);
    clearTimeout(goose.walkTimeout3);
    clearTimeout(goose.walkTimeout4);
    clearTimeout(goose.walkTimeout5);

    goose.walkTimeout1 = setTimeout(function() {
      goose.style.backgroundImage = idleImage;
    }, 80);

    goose.walkTimeout2 = setTimeout(function() {
      goose.style.backgroundImage = walkImage;
    }, 160);

    goose.walkTimeout3 = setTimeout(function() {
      goose.style.backgroundImage = idleImage;
    }, 240);

    goose.walkTimeout4 = setTimeout(function() {
      goose.style.backgroundImage = walkImage;
    }, 320);

    goose.walkTimeout5 = setTimeout(function() {
      goose.style.backgroundImage = idleImage;
    }, 400);
  }
}

startButton.addEventListener("click", function() {
  startScreen.style.display = "none";
  document.body.classList.add("playing");
  gameStarted = true;
  showGoose();
});

setInterval(function() {
  if (gameStarted === false) {
    return;
  }

  var gooseRect = goose.getBoundingClientRect();

  if (goose.style.display === "none") {
    return;
  }

  if (isTouchingAnyCorner(gooseRect) === true) {
    goose.style.display = "none";

    setTimeout(function() {
      showGoose();
    }, 300);

    return;
  }

  moveGooseIfTooClose();
}, 16);
