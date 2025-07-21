var cursor = document.getElementById("custom-cursor");
var goose = document.getElementById("goose");
var corners = document.querySelectorAll(".corner");

var startScreen = document.getElementById("start-screen");
var startButton = document.getElementById("start-button");

var endScreen = document.getElementById("end-screen");
var endScoreText = document.getElementById("end-score-text");
var restartButton = document.getElementById("restart-button");

var scoreDisplay = document.getElementById("score-display");
var timerDisplay = document.getElementById("timer-display");

var netWidth = 128;
var netHeight = 128;
var offsetX = netWidth / 2;
var offsetY = netHeight / 2;

var mouseX = 0;
var mouseY = 0;

var safeDistance = 110;
var moveDistance = 60;
var spawnMargin = 150;

var gameStarted = false;
var gooseIsMoving = false;
var gooseAnimationInterval = null;
var gooseAnimationState = "idle";

var score = 0;
var timeRemaining = 30.0;
var timerInterval = null;

document.addEventListener("mousemove", function(event) {
  if (gameStarted === false) {
    return;
  }

  mouseX = event.clientX;
  mouseY = event.clientY;

  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
  cursor.style.display = "block";
});

document.addEventListener("touchstart", function(event) {
  if (gameStarted === false) {
    return;
  }

  var touch = event.touches[0];
  mouseX = touch.clientX;
  mouseY = touch.clientY;

  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
  cursor.style.display = "block";

  event.preventDefault();
}, { passive: false });

document.addEventListener("touchmove", function(event) {
  if (gameStarted === false) {
    return;
  }

  var touch = event.touches[0];
  mouseX = touch.clientX;
  mouseY = touch.clientY;

  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";

  event.preventDefault();
}, { passive: false });

document.addEventListener("touchend", function() {
  if (gameStarted === false) {
    return;
  }

  cursor.style.display = "none";
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
    var rect = corners[i].getBoundingClientRect();

    var shrink = 90;

    var left = rect.left + shrink;
    var top = rect.top + shrink;
    var right = rect.right - shrink;
    var bottom = rect.bottom - shrink;

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

  return {
    x: Math.floor(x),
    y: Math.floor(y)
  };
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

  goose.style.backgroundImage = "url('assets/goose_idle_right.png')";
  goose.style.display = "block";
}

function startGooseAnimation(direction) {
  if (gooseAnimationInterval !== null) {
    return;
  }

  gooseAnimationState = "walk";
  goose.style.backgroundImage = "url('assets/goose_walk_" + direction + ".png')";

  gooseAnimationInterval = setInterval(function() {
    if (gooseIsMoving === false) {
      clearInterval(gooseAnimationInterval);
      gooseAnimationInterval = null;
      goose.style.backgroundImage = "url('assets/goose_idle_" + direction + ".png')";
      return;
    }

    if (gooseAnimationState === "walk") {
      goose.style.backgroundImage = "url('assets/goose_idle_" + direction + ".png')";
      gooseAnimationState = "idle";
    } else {
      goose.style.backgroundImage = "url('assets/goose_walk_" + direction + ".png')";
      gooseAnimationState = "walk";
    }
  }, 80);
}

function moveGooseIfTooClose() {
  var gooseRect = goose.getBoundingClientRect();

  var gooseCenterX = gooseRect.left + gooseRect.width / 2;
  var gooseCenterY = gooseRect.top + gooseRect.height / 2;

  var cursorCenterX = mouseX;
  var cursorCenterY = mouseY;

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

    gooseIsMoving = true;

    if (moveX > 0) {
      startGooseAnimation("right");
    } else {
      startGooseAnimation("left");
    }

    goose.style.left = newLeft + "px";
    goose.style.top = newTop + "px";

    clearTimeout(goose.stopTimeout);

    goose.stopTimeout = setTimeout(function() {
      gooseIsMoving = false;
    }, 200);
  }

  if (gooseIsMoving === false) {
    if (cursorCenterX < gooseCenterX) {
      goose.style.backgroundImage = "url('assets/goose_idle_right.png')";
    } else {
      goose.style.backgroundImage = "url('assets/goose_idle_left.png')";
    }
  }
}

function startTimer() {
  var startTime = Date.now();

  timerInterval = setInterval(function() {
    if (gameStarted === false) {
      return;
    }

    var now = Date.now();
    var elapsed = (now - startTime) / 1000;
    var remaining = 30.0 - elapsed;

    if (remaining < 0) {
      remaining = 0;
    }

    timeRemaining = remaining;
    timerDisplay.textContent = "Time Left: " + timeRemaining.toFixed(1) + "s";

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      gameStarted = false;
      cursor.style.display = "none";
      goose.style.display = "none";
      document.body.classList.remove("playing");
      endScoreText.textContent = "You caught " + score + " geese.";
      endScreen.style.display = "flex";
    }
  }, 100);
}

function startGame() {
  startScreen.style.display = "none";
  endScreen.style.display = "none";
  document.body.classList.add("playing");
  gameStarted = true;
  score = 0;
  timeRemaining = 30.0;
  scoreDisplay.textContent = "Geese Caught: 0";
  timerDisplay.textContent = "Time Left: 30.0s";
  startTimer();
  showGoose();
}

startButton.addEventListener("click", function() {
  startGame();
});

restartButton.addEventListener("click", function() {
  startGame();
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
    score = score + 1;
    scoreDisplay.textContent = "Geese Caught: " + score;
    goose.style.display = "none";

    setTimeout(function() {
      showGoose();
    }, 300);

    return;
  }

  moveGooseIfTooClose();
}, 16);
