// variables globales.

let gridSize;

// audio
let gameAudio;
let jump;
let squash;

// frog
let frog;
let spriters = {};
let finalFrogger;
let lifesImg;
let frogPlunk;

// cars
let cars = [];
let spritersCars = {};
let car;

// objetos de agua.
let spritersWater = {};
let trunks = [];
let trunk;
let turtle;
let turtles = [];

// snake
let snakeImg;
let snake;
let snakes = [];

// jugabilidad
let time;
let maxTime = 30; // 30 segundos para completar
let timeCounter = 0; // Contador de frames
let lifes;
let occupiedSpaces = [false, false, false, false, false]; // Espacios ocupados
let score = 0;
let highScore = 0;


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gridSize = height / 12; // Recalculamos el tamaño de la cuadrícula
}


function preload(){

  // audios.
  gameAudio = createAudio("/songs/game.mp3");
  jump = createAudio("/songs/jump.mp3");
  squash = createAudio("/songs/squash.wav");
  frogPlunk = createAudio("/songs/plunk.wav");
  
  // spriters frog
  spriters.still = loadImage("/assets/frogge.png");
  spriters.left = loadImage("/assets/frogger_left.png");
  spriters.right = loadImage("/assets/frogger_right.png");
  spriters.back = loadImage("/assets/frogger_back.png");
  lifesImg = loadImage("/assets/lifes.png");
  
  // objetos de Agua.
  spritersWater.trunk = loadImage("/assets/tronco.png");
  turtle = loadImage("/assets/turtle.png");
  
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
  time = maxTime; // Inicializar tiempo
  timeCounter = 0;
  
  // objetos del juego.
  frog = new Frog(gridSize, jump, spriters, occupiedSpaces);
  car = new Car(spritersCars.car, 0, gridSize * 6, gridSize, gridSize, -3);
  snake = new Snake(gridSize, snakeImg, width/2, gridSize * 5, gridSize * 2, gridSize, 2);
  trunk = new Trunk(spritersWater.trunk, 0, gridSize * 2, gridSize * 2, gridSize, 2);
  turtle = new Turtle(turtle, 0, gridSize * 1, gridSize * 3, gridSize, -2);

  
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

  // config de los troncos.
  for (let config of trunk.rows) {
    let separacion = width / config.count;
    for (let i = 0; i < config.count; i++) {
      let x = i * separacion;
      trunks.push(new Trunk(
        config.img,
        x,
        gridSize * config.fila,
        config.trunkW,
        gridSize,
        config.speed
      ));
    }
  }

  // config de las tortugas.
  for (let config of turtle.rows) {
    let separacion = width / config.count;
    for (let i = 0; i < config.count; i++) {
      let x = i * separacion;
      turtles.push(new Turtle(
        config.img,
        x,
        gridSize * config.fila,
        config.turtleW,
        gridSize,
        config.speed
      ));
    }
  }

}

function draw() {
  background(0);

  // Actualizar temporizador
  timeCounter++;
  if (timeCounter >= 60) { 
    time--;
    timeCounter = 0;
  }
  
  // Verificar si se acabó el tiempo
  if (time <= 0) {
    lifes--;
    score = Math.max(0, score - 50);
    frog.reset();
    time = maxTime; // Resetear tiempo
    timeCounter = 0;
    if (lifes <= 0) {
      lifes = 3;
      score = 0;
      frog.occupiedSpaces = [false, false, false, false, false];
    }
  }

  
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
  fill(0, 140, 0); 
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
          // Bonus por tiempo restante (10 puntos por segundo)
          score += time * 10;
          // Actualizar highScore si es necesario
          if (score > highScore) {
            highScore = score;
          }
        }
        // Resetear la posición de la rana al inicio
        frog.reset();
        time = maxTime; // Resetear tiempo
        timeCounter = 0;
        break;
      }
    }
  }
  
  // Verificar colisiones con carros
  for (let i = 0; i < cars.length; i++) {
    if (frog.checkCollision(cars[i])) {
      squash.play();
      lifes--;
      // Restar puntos por perder vida (no bajar de 0)
      score = Math.max(0, score - 50);
      frog.reset();      time = maxTime; // Resetear tiempo
      timeCounter = 0;      if (lifes <= 0) {
        // Game over: reiniciar
        lifes = 3;
        score = 0;
        frog.occupiedSpaces = [false, false, false, false, false];
      }
      break;
    }
  }
  
  // Verificar colisiones con serpientes
  for (let i = 0; i < snakes.length; i++) {
    if (frog.checkCollision(snakes[i])) {
      squash.play();
      lifes--;
      // Restar puntos por perder vida (no bajar de 0)
      score = Math.max(0, score - 50);
      frog.reset();      time = maxTime; // Resetear tiempo
      timeCounter = 0;      if (lifes <= 0) {
        // Game over: reiniciar
        lifes = 3;
        score = 0;
        frog.occupiedSpaces = [false, false, false, false, false];
      }
      break; 
    }
  }
  
  // Verificar si la rana está en el agua (filas 1-4)
  let frogRow = Math.floor(frog.pos.y / gridSize);
  if (frogRow >= 1 && frogRow <= 4) {
    // La rana está en el agua, verificar si está sobre un tronco o tortuga
    let onFloatingObject = false;
    let currentObject = null;
    
    // Verificar troncos
    for (let i = 0; i < trunks.length; i++) {
      if (frog.checkCollision(trunks[i])) {
        onFloatingObject = true;
        currentObject = trunks[i];
        break;
      }
    }
    
    // Si no está en un tronco, verificar tortugas
    if (!onFloatingObject) {
      for (let i = 0; i < turtles.length; i++) {
        if (frog.checkCollision(turtles[i])) {
          onFloatingObject = true;
          currentObject = turtles[i];
          break;
        }
      }
    }
    
    if (onFloatingObject && currentObject) {
      // Mover la rana con el objeto flotante
      frog.pos.x += currentObject.speed;
      
      // Si la rana se sale de la pantalla, perder vida
      if (frog.pos.x < 0 || frog.pos.x + frog.size > width) {
        frogPlunk.play();
        lifes--;
        score = Math.max(0, score - 50);
        frog.reset();
        time = maxTime; // Resetear tiempo
        timeCounter = 0;
        if (lifes <= 0) {
          lifes = 3;
          score = 0;
          frog.occupiedSpaces = [false, false, false, false, false];
        }
      }
    } else {
      // No está sobre un tronco o tortuga, se ahoga
      frogPlunk.play();
      lifes--;
      score = Math.max(0, score - 50);
      frog.reset();
      time = maxTime; // Resetear tiempo
      timeCounter = 0;
      if (lifes <= 0) {
        lifes = 3;
        score = 0;
        frog.occupiedSpaces = [false, false, false, false, false];
      }
    }
  }
  
  // Dibujar troncos
  for (let i = 0; i < trunks.length; i++){
    trunks[i].draw();
    trunks[i].update();
  }
  
  // Dibujar tortugas
  for (let i = 0; i < turtles.length; i++){
    turtles[i].draw();
    turtles[i].update();
  }
  
  // dibujar rana
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
  textSize(18);
  textAlign(LEFT, TOP);
  text('Vidas: ' + lifes, 20, 20);

  for (let i = 0; i < lifes; i++) {
    image(lifesImg, 20 + i * 40, 50, 30, 30);
  }
  

  textAlign(LEFT, BOTTOM);
  textSize(16);
  fill(255, 255, 255); // Blanco para mejor visibilidad
  text('Tiempo: ' + time + 's', 20, height - 45);
  
  // Barra de tiempo (inferior izquierda)
  let barWidth = 150;
  let barHeight = 12;
  let barX = 20;
  let barY = height - 30;
  
  // Fondo de la barra (negro para contraste)
  fill(0);
  stroke(255);
  strokeWeight(2);
  rect(barX, barY, barWidth, barHeight);
  
  // Barra de tiempo actual
  noStroke();
  let timePercent = time / maxTime;
  if (timePercent > 0.5) {
    fill(0, 255, 255); // Cian brillante
  } else if (timePercent > 0.25) {
    fill(255, 165, 0); // Naranja
  } else {
    fill(255, 0, 100); // Rosa/Rojo brillante
  }
  rect(barX + 2, barY + 2, (barWidth - 4) * timePercent, barHeight - 4);
  noStroke();
  
  // Mostrar puntos
  textAlign(RIGHT, TOP);
  textSize(18);
  fill(255);
  text('Puntos: ' + score, width - 20, 20);
  text('Record: ' + highScore, width - 20, 50);

}
