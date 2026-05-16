function drawStartScreen() {
  textFont(gameFont);
  background(27, 27, 64);

  fill(255);
  textAlign(CENTER);
  textSize(180);
  text("Tapper", width / 2, 200);


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
    textSize(32);
    fill(222, 199, 80);
    text("PRESS  SPACE  TO  START", width / 2, height - 120);
  }

  textFont('Arial');   
  textStyle(BOLD);       
  textSize(14);
  fill(255);
  
  text(
    "Arrow Keys ← ↑ ↓ → to Move | Hold SPACE to charge the beer, release to throw",
    width / 2,
    height - 60
  );
}

function drawGameOver() {  
  background(27, 27, 64);
  textFont(gameFont);
  fill(255);
  textAlign(CENTER);

  textSize(140);
  text("GAME OVER", width / 2, height / 2 - 40);

  textSize(52);
  text("SCORE  " + score, width / 2, height / 2 + 40);

  blinkTimer++;
  if (blinkTimer > 30) {
    blink = !blink;
    blinkTimer = 0;
  }

  if (blink) {
    fill(222, 199, 80);
    textSize(32);
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

  textSize(25);
  text("Score   " + score, 150, 60);
  text("Lives   " + lives, 150, 80);
}
