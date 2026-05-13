class Customer {
  constructor(lane) {
    this.lane = lane;
    this.x = customerX[lane];
    this.speed = 0.03 + level * 0.02;

    // tipo aleatorio (fila del sprite)
    this.type = floor(random(0, 8));
    
    // animación
    this.frame = 0;
    this.frameDelay = 10;
    this.frameCounter = 0;
    
    this.customerFrameWidth = customerSprite.width / 4;   // 132 / 4 = 33
    this.customerFrameHeight = customerSprite.height / 8; // 340 / 8 = 42.5
    
    this.state = "walking"; // "walking" | "backingUp" | "waiting" | "sendingBack" | "returning"
    this.returnSpeed = 0.12;
    this.backUpTarget = 1;   // hasta dónde retrocede antes de quedarse quieto
    this.waitTimer = 0;
    
    //pausa en el movimiento
    this.pauseTimer = 0;
    this.pauseInterval = floor(random(80, 150)); // cada cuántos frames hace pausa
    this.pauseDuration = floor(random(30, 60));  // cuántos frames dura la pausa
    this.stepCounter = 0;
    this.paused = false;
    
    //animación de bebida
    // Animación de "drinking" (colisión con cerveza)
    this.drinkFrames = 4;
    this.drinkFrameWidth = customerDrinkingSprite.width  / 4;   // 44px
    this.drinkFrameHeight = customerDrinkingSprite.height  / 8;  // 43px
    this.drinkFrame = 0;
    this.drinkFrameCounter = 0;
    this.drinkFrameDelay = 10;
    this.drinkAnimDone = false;
  }

  update() {
    // animación de frames — solo en walking
    if (this.state === "walking") {
      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.frame = (this.frame + 1) % 4;
        this.frameCounter = 0;
      }
    }
  
    if (this.state === "walking") {
      // lógica de pausa — solo afecta el movimiento
      if (this.paused) {
        this.pauseTimer--;
        if (this.pauseTimer <= 0) this.paused = false;
      } else {
        this.stepCounter++;
        if (this.stepCounter >= this.pauseInterval) {
          this.paused = true;
          this.pauseTimer = this.pauseDuration;
          this.stepCounter = 0;
        }
        this.x += this.speed; // solo avanza si no está en pausa
      }
    
      // si llega al bartender sin recibir cerveza
      if (this.x * scl >= playerX[this.lane]) {
        player.triggerScared();
        customers.splice(customers.indexOf(this), 1);
        loseLife();
        return;
      }
    
      // colisión con cerveza — siempre activa, pausa o no
      for (let beer of beers) {
        if (beer.lane === this.lane && !beer.isReturn && abs(beer.x - this.x) < 0.5) {
          beers.splice(beers.indexOf(beer), 1);
          score += 50;
      
          // Siempre empieza con la animación de drinking
          this.state = "drinking";
          this.drinkFrame = 0;
          this.drinkFrameCounter = 0;
          this.drinkAnimDone = false;
          this.willBackUp = random(1) < 0.45; // decide si retrocede o se va
          break;
        }
      }
      
      
    }
    
        else if (this.state === "drinking") {
      // Avanza frames de la animación drinking
      this.drinkFrameCounter++;
      if (this.drinkFrameCounter >= this.drinkFrameDelay) {
        this.drinkFrame++;
        this.drinkFrameCounter = 0;
        if (this.drinkFrame >= this.drinkFrames) {
          this.drinkFrame = this.drinkFrames - 1;
          this.drinkAnimDone = true;
        }
      }
    
      // Cuando termina la animación, decide qué hacer
      if (this.drinkAnimDone) {
        if (this.willBackUp) {
          this.backUpTarget = this.x - 2.5;
          this.state = "backingUp";
        } else {
          this.state = "returning";
        }
      }
    }
    
    
    else if (this.state === "backingUp") {
      this.x -= this.returnSpeed;
  
      if (this.x <= this.backUpTarget) {
        this.x = this.backUpTarget;
        this.waitTimer = 50; // frames quieto antes de empujar el vaso
        this.state = "waiting";
      }
  
    } else if (this.state === "waiting") {
      this.waitTimer--;
      if (this.waitTimer <= 0) {
        // empuja el vaso vacío hacia el bartender
        let emptyGlass = new Beer(this.lane);
        emptyGlass.x = this.x;
        emptyGlass.speed = -0.06; // negativo = va hacia la derecha (bartender)
        emptyGlass.isReturn = true;
        emptyGlass.isEmpty = true
        beers.push(emptyGlass);
        this.state = "walking"; // vuelve a avanzar 
      }
  
    } else if (this.state === "returning") {
      this.x -= this.returnSpeed;
  
      if (this.x < customerX[this.lane]) {
        customers.splice(customers.indexOf(this), 1);
      }
    }
  }

  show() {
    let drawWidth = 53;
    let drawHeight = 73;
  
    let offsets = [-8, -12, -12, -14, -15, -15, -18, -20];
    let baseY = laneY[this.lane] + 70;
    let y = baseY - drawHeight + offsets[this.type];
  
    if (this.state === "drinking") {
      // Usa el sprite CustomersDrinking
      let sx = this.drinkFrame * this.drinkFrameWidth;
      let sy = this.type * this.drinkFrameHeight;
      image(
        customerDrinkingSprite,
        this.x * scl,
        y,
        drawWidth + 250,
        drawHeight,
        sx,
        sy,
        this.drinkFrameWidth,
        this.drinkFrameHeight
      );
    } else {
      // Sprite de walking normal
      let sx = this.frame * this.customerFrameWidth;
      let sy = this.type * this.customerFrameHeight;
      image(
        customerSprite,
        this.x * scl,
        y,
        drawWidth,
        drawHeight,
        sx,
        sy,
        this.customerFrameWidth,
        this.customerFrameHeight
      );
    }
  }
}

function updateCustomers() {
  for (let i = customers.length - 1; i >= 0; i--) {
    if (customers[i]) {
      customers[i].update();
      if (customers[i]) customers[i].show();
    }
  }
}

function spawnCustomers() {
  if (random(1) < 0.01 + level * 0.003) {
    let lane = floor(random(0, lanes));
    let inLane = customers.filter(c => c.lane === lane).length;
    if (inLane < 2) {
      customers.push(new Customer(lane));
    }
  }
}
