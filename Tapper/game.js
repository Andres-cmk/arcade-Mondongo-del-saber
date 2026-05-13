let scl = 40;
let player, customers = [], beers = [];
let lanes = 4, level = 0, score = 0, lives = 3;

let laneY = [];
let playerX = [];
let customerX = [12, 10, 9, 8];

let frameWidth;
let frameHeight;

// START SCREEN
let startFrame = 0;
let startAnimTimer = 0;
let startTotalFrames = 3;

let gameState = "start";
let blink = true;
let blinkTimer = 0;

// Estados de pantallas intermedias
let screenTimer = 0;
let getReadyAnimFrame = 0;
let getReadyAnimTimer = 0;
let getReadyAnimFrames = 3; // idle tiene 3 frames, úsalo de base
let lifeLostTimer = 0;      // pausa tras perder una vida
let lifeLostDuration = 90;  // ~1.5 seg de pausa antes de ir a clearScreen

function setupGame() {
  createCanvas(1540, 700);
  
  laneY    = [115, 255, 395, 535];
  playerX  = [895, 955, 1025, 1090];

  player = new Player();
  
  frameWidth = spriteSheet.width / player.idleFrames; // 795 / 3 = 265
  frameHeight = spriteSheet.height;

}

function drawGame() {
  if (gameState === "start")       drawStartScreen();
  else if (gameState === "clear")  drawClearScreen();
  else if (gameState === "ready")  drawReadyScreen();
  else if (gameState === "play")   runGame();
  else if (gameState === "lifelost") drawLifeLost();
  else if (gameState === "gameover") drawGameOver();
}

function runGame() {
  image(imgFondo, 0, 0, width, height);

  drawBars();

  player.update();
  player.show();

  updateCustomers();
  updateBeers();

  showHUD();
  spawnCustomers();
}

function restartGame() {
  score = 0;
  lives = 3;
  customers = [];
  beers = [];
  level = 0;
  player = new Player();
  gameState = "clear";
  screenTimer = 0;
}

function handleInput() {
  if (gameState === "start" && keyCode === 32) {
    gameState = "clear";
    screenTimer = 0;
    return;
  }

  if (gameState === "play") {
    if (keyCode === UP_ARROW) player.move(-1);
    else if (keyCode === DOWN_ARROW) player.move(1);
    else if (keyCode === 32) player.startCharge();
  }

  if (gameState === "gameover" && (key === 'r' || key === 'R')) {
    restartGame();
  }
}

function handleRelease() {
  if (gameState === "play" && keyCode === 32) {
    player.releaseCharge();
  }
}

function loseLife() {
  lives--;
  music.stop(); 
  if (lives <= 0) {
    gameState = "gameover";
  } else {
    customers = [];
    beers = [];
    gameState = "lifelost";
    lifeLostTimer = 0;
  }
}

function drawClearScreen() {
  screenTimer++;
  background(27, 27, 64);
  textFont(gameFont);
  textAlign(CENTER);

  fill(222, 199, 80);
  textSize(55);
  text("CLEAR  ALL  CUSTOMERS  TO  ADVANCE", width / 2, height / 2 - 120);

  let bw = beerEmpty.width;
  let bh = beerEmpty.height;
  image(beerEmpty, width / 2 - 160, height / 2 - 60, 60, 70, 0, 0, bw, bh);
  fill(255);
  textSize(30);
  textAlign(LEFT);
  text("100 PTS", width / 2, height / 2 - 15);

  // Fila: imagen cliente + puntos
  let cw = customerSprite.width / 4;
  let ch = customerSprite.height / 8;
  // Usa el tipo 0, frame 0
  image(customerSprite, width / 2 - 160, height / 2 + 20, 60, 70, 0, 0, cw, ch);
  text("50 PTS", width / 2, height / 2 + 70);

  textAlign(CENTER);

  // Tras 5 segundos (300 frames a 60fps) pasa a ready
  if (screenTimer >= 300) {
    screenTimer = 0;
    getReadyAnimFrame = 0;
    getReadyAnimTimer = 0;
    gameState = "ready";
  }
}

function drawReadyScreen() {
  screenTimer++;
  
  background(27, 27, 64);
  textFont(gameFont);
  textAlign(CENTER);

  fill(222, 199, 80);
  textSize(55);
  text("GET  READY  TO  SERVE", width / 2, height / 2 - 120);

  // Animación idle del bartender
  getReadyAnimTimer++;
  if (getReadyAnimTimer > 12) {
    getReadyAnimFrame = (getReadyAnimFrame + 1) % getReadyAnimFrames;
    getReadyAnimTimer = 0;
  }
  let fw = spriteSheet.width / getReadyAnimFrames;
  let fh = spriteSheet.height;
  image(spriteSheet, width / 2 - 90, height / 2 - 40, 170, 170,
        getReadyAnimFrame * fw, 0, fw, fh);
        
  if (screenTimer >= 120) {
    screenTimer = 0;
    customers = [];
    beers = [];
    player = new Player();
    music.loop();   // ← inicia en loop
    if (music.isLoaded() && !music.isPlaying()) music.loop();
    gameState = "play";
  }
}

function drawLifeLost() {
  lifeLostTimer++;

  // Dibuja el juego congelado de fondo
  image(imgFondo, 0, 0, width, height);
  drawBars();
  player.show(); // bartender_scared ya estará activo desde triggerScared/beer
  showHUD();

  // Tras la pausa, va a clear screen
  if (lifeLostTimer >= lifeLostDuration) {
    player.state = "idle";
    player.scaredTimer = 0;
    player.frame = 0;
    gameState = "clear";
    screenTimer = 0;
  }
}
