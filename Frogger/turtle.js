class Turtle {
  
  constructor(img, x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.pos = createVector(x, y);
    this.speed = speed;

   
    this.rows = [
      { fila: 1, speed: -2, img: turtle, count: 3, turtleW: gridSize * 3 },
    ];
  }

  update() {
    this.pos.x += this.speed;
    

    if (this.speed < 0 && this.pos.x < -this.w) {
      this.pos.x = width; // Reaparece en el borde derecho
    } 

    else if (this.speed > 0 && this.pos.x > width) {
      this.pos.x = -this.w; // Reaparece en el borde izquierdo
    }
  }
  
  draw() {
   
    for (let i = 0; i < 3; i++) {
      image(this.img, this.pos.x + (i * gridSize), this.pos.y, gridSize, this.h);
    }
  }
}