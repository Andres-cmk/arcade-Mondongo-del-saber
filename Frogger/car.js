class Car {
  
  constructor(img, x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.pos = createVector(x,y);
    this.speed = speed;

    this.rows = [
      { fila: 6,  speed: -3, img: spritersCars.lorry,     count: 3, carW: gridSize * 2 },
      { fila: 7,  speed:  4, img: spritersCars.car_right,  count: 4, carW: gridSize },
      { fila: 8,  speed: -3, img: spritersCars.car,        count: 3, carW: gridSize },
      { fila: 9,  speed:  5, img: spritersCars.car_right,  count: 4, carW: gridSize },
      { fila: 10, speed: -4, img: spritersCars.lorry,      count: 2, carW: gridSize * 2 },

    ];

  }

  update() {
    
    this.pos.x += this.speed;
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
