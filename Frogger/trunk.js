class Trunk {
  
  constructor(img, x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.pos = createVector(x, y);
    this.speed = speed;

    this.rows = [
      { fila: 2, speed: 2, img: spritersWater.trunk, count: 3, trunkW: gridSize * 2 },
      { fila: 3, speed: -3, img: spritersWater.trunk, count: 2, trunkW: gridSize * 3 },
      { fila: 4, speed: 2.5, img: spritersWater.trunk, count: 4, trunkW: gridSize * 2 },
    ];
  }

  update() {
    this.pos.x += this.speed;
    
    // Si va a la izquierda (velocidad negativa) y se sale por el borde izquierdo
    if (this.speed < 0 && this.pos.x < -this.w) {
      this.pos.x = width; // Reaparece en el borde derecho
    } 
    // Si va a la derecha (velocidad positiva) y se sale por el borde derecho
    else if (this.speed > 0 && this.pos.x > width) {
      this.pos.x = -this.w; // Reaparece en el borde izquierdo
    }
  }
  
  draw() {
    image(this.img, this.pos.x, this.pos.y, this.w, this.h);
  }
}
