class Beer {
  constructor(lane) {
    this.lane = lane;
    this.x = playerX[lane] / scl;
    this.speed = 0.3 + level * 0.1;

    this.frame = 0;        // 👈 IMPORTANTE
    this.frameTimer = 0;   // 👈 para controlar velocidad
    this.beerFrames = 2;
    
    this.beerFrameWidth = beerThrown.width / 2;
    this.beerFrameHeight = beerThrown.height;
    
    
    this.broken = false;       // true cuando no había clientes y llega al borde
    this.brokenY = 0;          // posición Y actual de la caída
    this.brokenFrame = 0;      // frame de la animación cerveza_caida
    this.brokenFrameTimer = 0;
    this.brokenFrames = 4;
    this.brokenFrameWidth = 0; // se calcula al romper
    this.brokenFrameHeight = 0;
  }
  

  update() {
    if (this.broken) {
      // Cae hacia abajo
      this.brokenY += 4;
  
      // Avanza frames de la animación
      this.brokenFrameTimer++;
      if (this.brokenFrameTimer > 8) {
        this.brokenFrame++;
        this.brokenFrameTimer = 0;
      }
  
      // Cuando termina la animación, elimina y quita la vida
      if (this.brokenFrame >= this.brokenFrames) {
        beers.splice(beers.indexOf(this), 1);
        player.triggerScared();
        loseLife();
      }
      return;
    }
  
    this.x -= this.speed;
  
    // animación normal
    this.frameTimer++;
    if (this.frameTimer > 10) {
      this.frame = (this.frame + 1) % this.beerFrames;
      this.frameTimer = 0;
    }
  
    // Llega al borde izquierdo
    if (this.x <= customerX[this.lane]) {
      // ¿Hay algún cliente en esta fila?
      let hasCustomer = customers.some(c => c.lane === this.lane);
  
      if (!hasCustomer) {
        // Entra en modo caída y avisa al bartender
        this.broken = true;
        this.brokenY = laneY[this.lane] + 15;
        this.brokenFrameWidth = cervezaCaida.width / 4;
        this.brokenFrameHeight = cervezaCaida.height;
        player.triggerScared();
      } else {
        beers.splice(beers.indexOf(this), 1);
        player.triggerScared();
        loseLife();
      }
      return;
    }
  
    if (this.isReturn && this.x >= playerX[this.lane] / scl) {
      beers.splice(beers.indexOf(this), 1);
      player.triggerScared();
      loseLife();
      return;
    }
  }

  show() {
    if (this.broken) {
      let sx = this.brokenFrame * this.brokenFrameWidth;
      image(
        cervezaCaida,
        this.x * scl,
        this.brokenY,
        30,
        40,
        sx, 0,
        this.brokenFrameWidth,
        this.brokenFrameHeight
      );
      return;
    }
  
    let beer_sx = this.frame * this.beerFrameWidth;
    image(
      beerThrown,
      this.x * scl,
      laneY[this.lane] + 15,
      30,
      40,
      beer_sx, 0,
      this.beerFrameWidth,
      this.beerFrameHeight
    );
  }
}

function updateBeers() {
  for (let i = beers.length - 1; i >= 0; i--) {
    if (beers[i]) {
      beers[i].update();
      if (beers[i]) beers[i].show();
    }
  }
}
