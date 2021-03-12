const grid = document.querySelector('.grid');
let currentPlayerIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let spaceInvadersRemoved = [];
let results = 0;

resultsDisplay = document.querySelector('.results');

for (let i = 0; i < 255; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const spaceInvaders = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
];

function drawInvader() {
  for (let i = 0; i < spaceInvaders.length; i++) {
    if (!spaceInvadersRemoved.includes(i)) {
      squares[spaceInvaders[i]].classList.add('invader');
    }
  }
}

drawInvader();

function removeInvader() {
  for (let i = 0; i < spaceInvaders.length; i++) {
    squares[spaceInvaders[i]].classList.remove('invader');
  }
}

squares[currentPlayerIndex].classList.add('player');

function movePlayer(e) {
  squares[currentPlayerIndex].classList.remove('player');
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPlayerIndex % width !== 0) currentPlayerIndex -= 1;
      break;
    case 'ArrowRight':
      if (currentPlayerIndex % width < width - 1) currentPlayerIndex += 1;
      break;
  }
  squares[currentPlayerIndex].classList.add('player');
}
document.addEventListener('keydown', movePlayer);

function moveInvaders() {
  const leftEdge = spaceInvaders[0] % width === 0;
  const rightEdge = spaceInvaders[spaceInvaders.length - 1] % width === width - 1;
  removeInvader();

  if (rightEdge && goingRight) {
    for (let i = 0; i < spaceInvaders.length; i++) {
      spaceInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < spaceInvaders.length; i++) {
      spaceInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < spaceInvaders.length; i++) {
    spaceInvaders[i] += direction;
  }

  drawInvader();

  if (squares[currentPlayerIndex].classList.contains('invader', 'player')) {
    resultsDisplay.innerHTML = 'GAME OVER';
    clearInterval(invadersId);
  }

  for (let i = 0; i < spaceInvaders.length; i++) {
    if (spaceInvaders[i] > squares.length) {
      resultsDisplay.innerHTML = 'GAME OVER';
      clearInterval(invadersId);
    }
  }
  if (spaceInvadersRemoved.length === spaceInvaders.length) {
    resultsDisplay.innerHTML = 'VICTORY';
    clearInterval(invadersId);
  }
}

invadersId = setInterval(moveInvaders, 300);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentPlayerIndex;

  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser');
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add('laser');

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser');
      squares[currentLaserIndex].classList.remove('invader');
      squares[currentLaserIndex].classList.add('boom');

      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
      clearInterval(laserId);

      const blastedSpaceInvader = spaceInvaders.indexOf(currentLaserIndex);
      spaceInvadersRemoved.push(blastedSpaceInvader);
      results++;
      resultsDisplay.innerHTML = results;
    }
  }

  switch (e.key) {
    case ' ':
      laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener('keydown', shoot);
