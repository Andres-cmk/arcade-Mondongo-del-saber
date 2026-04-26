function drawStartScreen() {
  textFont(gameFont);
  background(20, 20, 30);

  fill(255);
  textAlign(CENTER);
  textSize(150);
  text("Tapper", width / 2, 120);

  textSize(40);
  text("ARCADE", width / 2, 170);

  startAnimTimer++;
  if (startAnimTimer > 12) {
    startFrame = (startFrame + 1) % startTotalFrames;
    startAnimTimer = 0;
  }

  let fw = spriteSheet3.width / startTotalFrames;
  let fh = spriteSheet3.height;

  image(spriteSheet3, width/2 - 120, height/2 - 90, 230, 290,
        startFrame * fw, 0, fw, fh);

  blinkTimer++;
  if (blinkTimer > 30) {
    blink = !blink;
    blinkTimer = 0;
  }

  if (blink) {
    textSize(28);
    text("PRESS SPACE TO START", width / 2, height - 120);
  }

  textFont('Arial');
  textSize(16);
  fill(180);
  text("Arrow Keys = Move | Space = Throw Beer", width / 2, height - 60);
}

function drawGameOver() {
  background(0);
  textFont(gameFont);
  fill(255);
  textAlign(CENTER);

  textSize(150);
  text("GAME OVER", width / 2, height / 2 - 40);

  textSize(24);
  text("Score " + score, width / 2, height / 2);

  blinkTimer++;
  if (blinkTimer > 30) {
    blink = !blink;
    blinkTimer = 0;
  }

  if (blink) {
    textSize(28);
    text("Press R to restart", width / 2, height - 120);
  }
}

function drawBars() {
  //stroke(200);
  //strokeWeight(3);
  for (let i = 0; i < lanes; i++) {
    line(0, laneY[i] + 70, width, laneY[i] + 70);
  }
}

function showHUD() {
  textFont(gameFont);
  noStroke();
  fill(255);

  textSize(16);
  text("Level " + level, 100, 20);
  text("Score " + score, 100, 40);
  text("Lives " + lives, 100, 60);


}
