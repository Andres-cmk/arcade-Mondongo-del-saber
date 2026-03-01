// variables globales.

let gridSize;

// audio
let gameAudio;
let jump;

// frog
let frog;
let spriters = {};
let finalFrogger;
let lifesImg;

// cars
let cars = [];
let spritersCars = {};
let car;

// objetos de agua.
let spritersWater = {};

// snake
let snakeImg;
let snake;
let snakes = [];

// jugabilidad
let time;
let lifes;
let level;
let occupiedSpaces = [false, false, false, false, false]; // Espacios ocupados
let score = 0;
let highScore = 0;
let levelUpScore = 1000; // Puntos necesarios para subir de nivel


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gridSize = height / 12; // Recalculamos el tamaño de la cuadrícula
}


function preload(){

  // audios.
  gameAudio = createAudio("/songs/game.mp3");
  jump = createAudio("/songs/jump.mp3");
  
  // spriters frog
  spriters.still = loadImage("/assets/frogge.png");
  spriters.left = loadImage("/assets/frogger_left.png");
  spriters.right = loadImage("/assets/frogger_right.png");
  spriters.back = loadImage("/assets/frogger_back.png");
  lifesImg = loadImage("/assets/lifes.png");
  
  // objetos de Agua.
  spritersWater.trunk = loadImage("/assets/tronco.png");
  
  // imagen final
  finalFrogger = loadImage("/assets/final_frogger.png");
  
  // spriters car
  spritersCars.lorry = loadImage("/assets/lorry.png");
  spritersCars.car = loadImage("/assets/car.png");
  spritersCars.car_right = loadImage("/assets/car_right.png");

  // spriters snake
  snakeImg = loadImage("/assets/snake.png");
  
}

function keyPressed() {
  frog.update(keyCode);
  if (keyCode === LEFT_ARROW) {
    frog.move(-1, 0);  
  } else if (keyCode === RIGHT_ARROW) {
    frog.move(1, 0);   
  } else if (keyCode === UP_ARROW) {
    frog.move(0, -1);
  } else{
    frog.move(0, 1);
  }
}

function mousePressed() {gameAudio.loop();}


function setup() {

  createCanvas(windowWidth, windowHeight);
  // Dividimos la altura de la pantalla exactamente en 12.
  gridSize = height / 12;
  noStroke();
  gameAudio.volume(0.3);
  jump.volume(0.5);
  
  // Inicializar vidas y puntos
  lifes = 3;
  score = 0;
  
  // objetos del juego.
  frog = new Frog(gridSize, jump, spriters, occupiedSpaces);
  car = new Car(spritersCars.car, 0, gridSize * 6, gridSize, gridSize, -3);
  snake = new Snake(gridSize, snakeImg, width/2, gridSize * 5, gridSize * 2, gridSize, 2);

  
  // config de los carros.
  for (let config of car.rows) {
    let separacion = width / config.count; // espacio disponible por carro
    for (let i = 0; i < config.count; i++) {
      let x = i * separacion;
      cars.push(new Car(
        config.img,
        x,
        gridSize * config.fila,
        config.carW,
        gridSize,
        config.speed
      ));
    }
  }
  

  // config de las serpientes.
  for (let s of snake.row) {
    let separacion = width / s.count;
    for (let i = 0; i < s.count; i++) {
      let x = i * separacion;
      snakes.push(new Snake(
        gridSize, 
        s.img, 
        x, 
        gridSize * s.fila,
         s.snakeW, 
         gridSize, 
         s.speed));
    }
  }

}

function draw() {
  background(0);

  
  fill(255, 190, 11);
  // Así que vamos a dibujar líneas divisorias en las filas 7, 8, 9 y 10.
  for (let fila = 7; fila <= 10; fila++) {
    
    // Calculamos la altura exacta donde va esta línea divisoria
    let yLine = fila * gridSize; 
    
    // Este segundo bucle dibuja los "guiones" a lo largo de toda la pantalla
    for (let xPos = 0; xPos < width; xPos += 60) {
      rect(xPos, yLine, 30, 4); 
    }
  }
 
  
  //agua del rio.
  fill(0, 0, 150); 
  rect(0, gridSize, width, gridSize * 4);

  // los andenes 
  fill(100, 200, 100); 
  // Andén del medio
  rect(0, gridSize * 5, width, gridSize); 
  rect(0, height - gridSize, width, gridSize);

  // Zona de llegada.
  fill(0, 150, 0); 
  rect(0, 0, width, gridSize);


  // Puestos de llegada.
  fill(0, 0, 150); 
  let separacion = width / 5;
  for (let i = 0; i < 5; i++) {
    // Calculamos el centro exacto para cada hueco
    let xPos = (i * separacion) + (separacion / 2) - (gridSize / 2); 
    // Los huecos ahora miden exactamente lo mismo que la rana (gridSize)
    
    if (frog.occupiedSpaces[i]) {
      // Si el espacio está ocupado, mostramos la imagen final_frogger
      image(finalFrogger, xPos, 0, gridSize, gridSize);
    } else {
      // Si no está ocupado, mostramos el espacio azul
      rect(xPos, 0, gridSize, gridSize);
    }
  }
  
  // Verificar si la rana llegó a un espacio final
  if (frog.pos.y === 0) {
    let separacion = width / 5;
    for (let i = 0; i < 5; i++) {
      let xPos = (i * separacion) + (separacion / 2) - (gridSize / 2);
      // Verificar si la rana está dentro de este espacio
      if (frog.pos.x >= xPos && frog.pos.x < xPos + gridSize) {
        if (!frog.occupiedSpaces[i]) {
          // Marcar el espacio como ocupado
          frog.occupiedSpaces[i] = true;
          // Sumar puntos por llegar a un espacio
          score += 100;
          // Actualizar highScore si es necesario
          if (score > highScore) {
            highScore = score;
          }
        }
        // Resetear la posición de la rana al inicio
        frog.reset();
        break;
      }
    }
  }
  
  // Verificar colisiones con carros
  for (let i = 0; i < cars.length; i++) {
    if (frog.checkCollision(cars[i])) {
      lifes--;
      // Restar puntos por perder vida (no bajar de 0)
      score = Math.max(0, score - 50);
      frog.reset();
      if (lifes <= 0) {
        // Game over: reiniciar
        lifes = 3;
        score = 0;
        frog.occupiedSpaces = [false, false, false, false, false];
      }
      break; // Salir del loop después de detectar colisión
    }
  }
  
  // Verificar colisiones con serpientes
  for (let i = 0; i < snakes.length; i++) {
    if (frog.checkCollision(snakes[i])) {
      lifes--;
      // Restar puntos por perder vida (no bajar de 0)
      score = Math.max(0, score - 50);
      frog.reset();
      if (lifes <= 0) {
        // Game over: reiniciar
        lifes = 3;
        score = 0;
        frog.occupiedSpaces = [false, false, false, false, false];
      }
      break; // Salir del loop después de detectar colisión
    }
  }
  
  frog.draw();
  
  for (let i = 0; i < cars.length; i++){
    cars[i].draw();
    cars[i].update();
  }

  for (let i = 0; i < snakes.length; i++){
    snakes[i].draw();
    snakes[i].update();
  }
  
  // Mostrar vidas
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text('Vidas: ' + lifes, 20, 20);
  // También puedes mostrar las vidas con imágenes
  for (let i = 0; i < lifes; i++) {
    image(lifesImg, 20 + i * 40, 50, 30, 30);
  }
  
  // Mostrar puntos
  textAlign(RIGHT, TOP);
  text('Puntos: ' + score, width - 20, 20);
  text('Record: ' + highScore, width - 20, 50);

}
