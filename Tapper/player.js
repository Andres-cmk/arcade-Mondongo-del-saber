class Player {
  constructor() {
    this.lane = 0;
    this.frame = 0;
    this.frameDelay = 8;
    this.frameCounter = 0;
    this.state = "idle"; 
    this.throwFrames = 2; 
    this.idleFrames = 3;
    this.isCharging = false; // está espichando (espacio presionado)
    this.hOffset = 0;        // desplazamiento horizontal dentro de la fila
    
    this.runFrames = 4;
    this.facingLeft = false;     // true cuando se mueve hacia la izquierda
    
    // Estado scared (vaso roto sin cliente)
    this.scaredTimer = 0;        // cuántos frames dura la cara de susto
    
    // Estado change (cambio de fila)
    this.isChanging = false;     // está en animación de cambio
    this.changeTimer = 0;        // duración del frame de cambio
    this.changeDuration = 20;    // frames que dura bartender_change antes de moverse
    this.pendingLaneDir = 0;     // dirección de fila pendiente (-1 o +1)
    
    // Partículas del cambio de fila
    this.particles = [];         // lista de partículas activas
  }

  move(dir) {
    if (this.isChanging) return; // ignora si ya está cambiando
    this.isChanging = true;
    this.changeTimer = 0;
    this.pendingLaneDir = dir;
  
    // Crea partículas en la posición actual
    let px = playerX[this.lane] - this.hOffset * scl - 30;
    let py = laneY[this.lane];
    this.particles.push({
      x: px, y: py,
      frame: 0,
      frameTimer: 0,
      totalFrames: 4,
      frameWidth: 0,  // se calcula al dibujar
      done: false
    });
  }
  
  triggerScared() {
  this.state = "scared";
  this.scaredTimer = 40; // dura 40 frames (~0.67 seg a 60fps)
  }
  
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.frameTimer++;
      if (p.frameTimer > 8) {
        p.frame++;
        p.frameTimer = 0;
      }
      if (p.frame >= p.totalFrames) {
        this.particles.splice(i, 1);
      }
    }
  }

  moveHorizontal(dir) {
    // Límite izquierdo es la posición en que aparecen los clientes
    let maxOffset = (playerX[this.lane] / scl) - customerX[this.lane];
    this.hOffset = constrain(this.hOffset + dir * 0.15, 0, maxOffset);
  }

  startCharge() {
    if (this.state !== "throw") {
      this.hOffset = 0; // vuelve al punto de lanzamiento
      this.isCharging = true;
      this.state = "throw";
      this.frame = 0;
      this.frameCounter = 0;
    }
  }
  
  releaseCharge() {
    if (this.isCharging) {
      this.isCharging = false;
      beers.push(new Beer(this.lane));
      // El estado "throw" continúa y vuelve a idle solo cuando termina
    }
  }

  update() {
    // --- Movimiento horizontal fluido ---
    if (!this.isChanging) {
      if (keyIsDown(LEFT_ARROW)) {
        this.moveHorizontal(1);
        this.facingLeft = false;
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.moveHorizontal(-1);
        this.facingLeft = true;
      }
      // Si ninguna tecla de movimiento horizontal está presionada, cara al frente
      if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
        this.facingLeft = false;
      }
    }
  
    // --- Estado scared ---
    if (this.state === "scared") {
      this.scaredTimer--;
      if (this.scaredTimer <= 0) {
        this.state = "idle";
        this.frame = 0;
      }
      // Actualiza partículas igualmente
      this.updateParticles();
      return;
    }
  
    // --- Animación de cambio de fila ---
    if (this.isChanging) {
      this.changeTimer++;
      if (this.changeTimer >= this.changeDuration) {
        // Ejecuta el cambio real de fila
        this.lane = constrain(this.lane + this.pendingLaneDir, 0, lanes - 1);
        this.hOffset = 0;
        this.isChanging = false;
        this.changeTimer = 0;
        this.state = "idle";
        this.frame = 0;
      }
      this.updateParticles();
      return;
    }
  
    // --- Frames normales ---
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frame++;
      this.frameCounter = 0;
  
      if (this.state === "idle") {
        // Usa runFrames si se está moviendo, idleFrames si no
        let maxFrames = (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW))
          ? this.runFrames
          : this.idleFrames;
        this.frame = this.frame % maxFrames;
      }
      else if (this.state === "throw") {
        if (this.isCharging) {
          this.frame = 0;
        } else {
          if (this.frame >= this.throwFrames) {
            this.state = "idle";
            this.frame = 0;
          }
        }
      }
    }
  
    // --- Recogida de vasos ---
    for (let i = beers.length - 1; i >= 0; i--) {
      let beer = beers[i];
      if (beer.isReturn && beer.lane === this.lane) {
        let playerXInGrid = (playerX[this.lane] - this.hOffset * scl) / scl;
        if (beer.x >= playerXInGrid - 1) {
          beers.splice(i, 1);
          score += 100;
        }
      }
    }
  
    this.updateParticles();
  }

  show() {
    let x = playerX[this.lane] - this.hOffset * scl;
    let y = laneY[this.lane];
  
    // --- Dibuja partículas (se quedan en la fila anterior si ya cambió) ---
    for (let p of this.particles) {
      if (particles.width > 0) {
        let pw = particles.width / 4;
        let ph = particles.height;
        let sx = p.frame * pw;
        image(particles, p.x, p.y, 80, 80, sx, 0, pw, ph);
      }
    }
  
    // --- Dibuja al bartender según estado ---
    if (this.state === "scared") {
      image(bartenderScared, x, y, 115, 115);
      return;
    }
  
    if (this.isChanging) {
      image(bartenderChange, x, y, 115, 115);
      return;
    }
  
    if (this.state === "throw" || this.isCharging) {
      let fw = playerThrow.width / this.throwFrames;
      let sx = this.frame * fw;
      image(playerThrow, x, y, 115, 115, sx, 0, fw, frameHeight);
      return;
    }
  
    // Idle o corriendo
    if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
      // Animación de correr
      let fw = bartenderRun.width / this.runFrames;
      let sx = this.frame * fw;
  
      if (this.facingLeft) {
        // Voltear horizontalmente para correr a la izquierda
        push();
        translate(x + 115, y);
        scale(-1, 1);
        image(bartenderRun, 0, 0, 115, 115, sx, 0, fw, bartenderRun.height);
        pop();
      } else {
        image(bartenderRun, x, y, 115, 115, sx, 0, fw, bartenderRun.height);
      }
    } else {
      // Idle normal
      let sx = this.frame * frameWidth;
      image(spriteSheet, x, y, 115, 115, sx, 0, frameWidth, frameHeight);
    }
  }
}
