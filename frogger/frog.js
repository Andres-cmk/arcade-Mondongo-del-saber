class Frog{
  
  constructor(size,audio, spriters, occupiedSpaces){
    this.size = size;
    this.img = spriters.still;
    this.pos = createVector( width/2 , height - this.size);
    this.audioJump = audio;
    this.occupiedSpaces = occupiedSpaces;
    
    this.spriters = spriters;
    
    
  }
  
  
  move(xDir, yDir) {
    
    // Calcular la nueva posición antes de aplicarla
    let newX = this.pos.x + xDir * this.size;
    let newY = this.pos.y + yDir * this.size;
    
    // Aplicar constraints
    newX = constrain(newX, 0, width - this.size);
    newY = constrain(newY, 0, height - this.size);
    
    // Si intenta moverse a la fila superior (y = 0), verificar que esté en un hueco válido
    if (newY === 0) {
      let isValidSpot = false;
      let separacion = width / 5;
      
      for (let i = 0; i < 5; i++) {
        let xPos = (i * separacion) + (separacion / 2) - (this.size / 2);
        // Verificar si la posición x está dentro de este hueco
        if (newX >= xPos && newX < xPos + this.size) {
          if (this.occupiedSpaces[i]) {
            return; // El hueco ya está ocupado, no permitir el movimiento
          }
          isValidSpot = true;
          break;
        }
      }

      if (!isValidSpot) {
        return; 
      }

    }
    
    // Reiniciar el audio al inicio y reproducirlo
    this.audioJump.stop();
    this.audioJump.play();
    this.pos.x = newX;
    this.pos.y = newY;

  }

  
  update(t){
    if (t == LEFT_ARROW){
        this.img = this.spriters.left;
    } else if(t == RIGHT_ARROW) {
        this.img = this.spriters.right;
    } else if(t == UP_ARROW){
      this.img = this.spriters.still;
    } else if(this.pos.y != height - this.size) {
      this.img = this.spriters.back;
    }
  }
  
  checkCollision(obstacle) {
  
    return (
      this.pos.x < obstacle.pos.x + obstacle.w &&
      this.pos.x + this.size > obstacle.pos.x &&
      this.pos.y < obstacle.pos.y + obstacle.h &&
      this.pos.y + this.size > obstacle.pos.y
    );
  }
  
  reset() {
    this.pos.x = width / 2;
    this.pos.y = height - this.size;
    this.img = this.spriters.still;
  }
  
  draw() {
    image(this.img, this.pos.x, this.pos.y, this.size, this.size);
  }
}
