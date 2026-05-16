//---------------------------------------------
// Juego Sokoban estilo invierno
//---------------------------------------------

// Constantes
const VACIO = 0;
const PARED = 1;
const MANZANA = 2;
const ARBOL = 3;
const HOJAS = 4;

let simboloManzana = '🍎';
let simboloArbol = '🌳';
let simboloHojas = '🍂';
let simboloJugador = '🐻';

// Sprites
let spriteOso;
let spriteManzana;
let spriteArbol;
let spriteHojas;
let pantallaFinal;

let spriteCamino;
let spritePared;
let spriteBorde;

// Variables para movimiento suave
let drawPlayerX;
let drawPlayerY;
let velocidadJugador = 0.15;

// Variables para animación del sprite del oso
let spriteFrameSize = 130; // Tamaño de cada frame en el sprite sheet (32*10 para escalar)
let spriteCols = 6;       // Columnas en el sprite sheet (6 frames de animación)
let spriteRows = 4;       // Filas en el sprite sheet
let frameActual = 0;      // Frame actual de animación
let direccionOso = 0;     // 0=abajo, 1=arriba, 2=izquierda, 3=derecha
let ultimoCambioFrame = 0;
let tiempoPorFrame = 150; // ms por frame de animación
let jugadorMoviendose = false;
let escalaSprite = 0.9;   // Escala para centrar mejor el sprite

// Estado del juego
let juegoTerminado = false;

let Song1;
let sonidoReproducido = false;

let cellSize;
let gridWidth = 11;
let gridHeight = 11;

let table = [];
let suelo = [];   // Paredes y manzanas
let objetos = []; // Árboles y hojas
let playerX, playerY;
let opcion = 1;
let nivelesData;

// Variables para movimiento con mouse
let mouseMoviendo = false;
let direccionMouseX = 0;
let direccionMouseY = 0;
let ultimoMovimiento = 0;

// Variables para movimiento continuo con teclado
let ultimoMovimientoTecla = 0;
let retrasoMovimiento = 250;

function preload() {
  Song1 = loadSound("Audio.mp3");
  
  spriteOso = loadImage("sprites/oso.png");
  spriteManzana = loadImage("sprites/manzana.png");
  spriteArbol = loadImage(encodeURI("sprites/árbol.png"));
  spriteHojas = loadImage("sprites/hojas.png");
  pantallaFinal = loadImage(encodeURI("sprites/pantalla final.png"));

  spriteCamino = loadImage("sprites/camino.png");
  spritePared = loadImage("sprites/pared.png");
  spriteBorde = loadImage("sprites/borde.png");
}

function reproducirNuevamente() {
  Song1.play();
}

// ================= NIVELES =================
function cargarNiveles() {
  return [
    [
      ["#","#","#","#","#","#","#","#","#","#","#"],
      ["#","$",1,1,1,1,1,1,".",1,"#"],
      ["#",1,1,"#","#","#","#","#","#","P","#"],
      ["#",1,1,1,1,1,1,1,".",1,"#"],
      ["#",1,1,"#","#","#","#","#","#",1,"#"],
      ["#","$",".",1,1,1,1,1,1,1,"#"],
      ["#",1,1,"#","#","#","#","#","#",1,"#"],
      ["#",1,1,"#","#","#","#","#","#",1,"#"],
      ["#",1,1,"$",1,1,1,1,1,1,"#"],
      ["#","#","#","#","#","#","#","#","#","#","#"],
      ["#","#","#","#","#","#","#","#","#","#","#"],
    ],
    [
      ["#","#","#","#","#","#","#","#","#","#","#"],
      ["#","P","#","#","#","#","#",1,1,"#","#"],
      ["#",1,1,".",1,1,1,1,1,1,"#"],
      ["#","#",1,"#","#","#",1,1,1,1,"#"],
      ["#",1,1,1,1,1,1,1,"#",1,"#"],
      ["#",1,1,"#","#","#","#","#","#","#","#"],
      ["#",1,1,1,1,1,1,1,1,1,"#"],
      ["#",1,1,"#","#","#","#","#","#",1,"#"],
      ["#",1,1,1,1,1,1,1,1,"$","#"],
      ["#","#","#","#","#","#","#","#","#","#","#"],
      ["#","#","#","#","#","#","#","#","#","#","#"],
    ],
    [
      ["#","#","#","#","#","#","#","#","#","#","#"],
      ["#","$","#",1,1,1,"#",1,1,"P","#"],
      ["#",1,1,1,1,1,1,".","#",1,"#"],
      ["#",1,1,"#","#",1,1,1,".",1,"#"],
      ["#",1,1,"#","#",1,1,"#","$","#","#"],
      ["#",1,1,"#","#",1,1,"#",".",1,"#"],
      ["#","$",1,1,1,1,1,"#",1,1,"#"],
      ["#",1,1,1,1,".",1,1,1,1,"#"],
      ["#",1,1,1,1,"#",1,1,1,"$","#"],
      ["#","#","#","#","#","#","#","#","#","#","#"],
      ["#","#","#","#","#","#","#","#","#","#","#"],
    ],
    [
      ["#","#","#","#","#","#","#","#","#","#","#"],
      ["#","P",1,1,1,1,1,1,1,1,"#"],
      ["#",1,"#",1,"#",1,"#",1,"#",1,"#"],
      ["#",1,1,".",1,".",1,".",1,1,"#"],
      ["#",1,"#",1,"#",1,"#",1,"#",1,"#"],
      ["#",1,1,".",1,".",1,1,1,1,"#"],
      ["#",1,"#",1,"#",1,"#",1,1,1,"#"],
      ["#",1,1,".",1,1,1,1,1,"$","#"],
      ["#",1,"#",1,"#","$","$","$","$","$","#"],
      ["#","#","#","#","#","#","#","#","#","#","#"],
      ["#","#","#","#","#","#","#","#","#","#","#"],
    ]
  ];
}

// ================= SETUP =================
function setup() {
  // Configuración para sprites pixel art
  pixelDensity(1);
  noSmooth();
  
  nivelesData = cargarNiveles();
  entorno();
  botones();
}

function entorno() {
  // Espacio disponible en pantalla
  let espacioHorizontal = windowWidth;
  let espacioVertical = windowHeight - 40;

  // Calcular tamaño máximo posible de celda
  cellSize = floor(min(
    espacioHorizontal / gridWidth,
    espacioVertical / gridHeight
  ));

  // Crear canvas del tamaño exacto del tablero
  createCanvas(gridWidth * cellSize, gridHeight * cellSize + 40);

  // Centrar el canvas
  let canvas = document.querySelector('canvas');
  canvas.style.display = 'block';
  canvas.style.margin = 'auto';

  cargarNivel();
}

function cargarNivel() {
  let nivelOriginal = JSON.parse(JSON.stringify(nivelesData[opcion - 1]));

  suelo = [];
  objetos = [];

  for (let i = 0; i < gridHeight; i++) {
    suelo[i] = [];
    objetos[i] = [];

    for (let j = 0; j < gridWidth; j++) {

      let celda = nivelOriginal[i][j];

      if (celda === "#") {
        suelo[i][j] = PARED;
        objetos[i][j] = null;
      }
      else if (celda === ".") {
        suelo[i][j] = VACIO;
        objetos[i][j] = MANZANA;
      }
      else if (celda === "$") {
        suelo[i][j] = ARBOL;
        objetos[i][j] = null;
      }
      else if (celda === "P") {
        playerX = j;
        playerY = i;
        drawPlayerX = playerX;
        drawPlayerY = playerY;
        suelo[i][j] = VACIO;
        objetos[i][j] = null;
      }
      else {
        suelo[i][j] = VACIO;
        objetos[i][j] = null;
      }
    }
  }
}

// ================= DIBUJO =================
function draw() {
  // Si el juego terminó, mostrar pantalla final
  if (juegoTerminado) {
    image(pantallaFinal, 0, 0, width, height);
    return;
  }
  
  background("#6EA4BF");

  // Movimiento continuo con teclado
  if (millis() - ultimoMovimientoTecla > retrasoMovimiento) {
    if (keyIsDown(UP_ARROW)) {
      mover(0, -1);
      ultimoMovimientoTecla = millis();
    }
    else if (keyIsDown(DOWN_ARROW)) {
      mover(0, 1);
      ultimoMovimientoTecla = millis();
    }
    else if (keyIsDown(LEFT_ARROW)) {
      mover(-1, 0);
      ultimoMovimientoTecla = millis();
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      mover(1, 0);
      ultimoMovimientoTecla = millis();
    }
  }

  // Mover continuamente si el mouse está sostenido
  if (mouseMoviendo && millis() - ultimoMovimiento > 150) {
    mover(direccionMouseX, direccionMouseY);
    ultimoMovimiento = millis();
  }

  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {

      let x = j * cellSize;
      let y = i * cellSize;

      stroke("#4A7A8C");
      noFill();
      rect(x, y, cellSize, cellSize);

      let base = suelo[i][j];
      let obj = objetos[i][j];

      // Borde del mapa
      if (i === 0 || j === 0 || i === gridHeight - 1 || j === gridWidth - 1) {
        image(spriteBorde, x, y, cellSize, cellSize);
      }
      else if (base === PARED) {
        image(spritePared, x, y, cellSize, cellSize);
      }
      else {
        // Variación visual para el camino
        tint(255, 240 + random(15));
        image(spriteCamino, x, y, cellSize, cellSize);
        noTint();

        if (base === ARBOL) {
          image(spriteArbol, x, y, cellSize, cellSize);
        }

        if (obj === MANZANA) {
          let flotacion = sin(frameCount * 0.08) * 3;
          image(spriteManzana, x, y - flotacion, cellSize, cellSize);
        }

        if (obj === HOJAS) {
          image(spriteHojas, x, y, cellSize, cellSize);
        }
      }
    }
  }

  // Animación de caminata - solo cuando el jugador se está moviendo
  if (jugadorMoviendose && millis() - ultimoCambioFrame > tiempoPorFrame) {
    frameActual = (frameActual + 1) % spriteCols;
    ultimoCambioFrame = millis();
  }
  
  // Dibujar jugador con sprite sheet
  drawPlayerX += (playerX - drawPlayerX) * velocidadJugador;
  drawPlayerY += (playerY - drawPlayerY) * velocidadJugador;
  
  // Calcular dimensiones de cada frame en el sprite sheet
  let frameWidth = spriteOso.width / spriteCols;
  let frameHeight = spriteOso.height / spriteRows;
  
  // Calcular posición del frame en el sprite sheet
  let px = drawPlayerX * cellSize;
  let py = drawPlayerY * cellSize;
  
  push();
  
  if (direccionOso === 2) { // izquierda
    scale(-1, 1);
    
    image(
      spriteOso,
      -px - cellSize,
      py,
      cellSize,
      cellSize,
      frameActual * frameWidth,
      3 * frameHeight,   // usar fila derecha
      frameWidth,
      frameHeight
    );
  }
  else if (direccionOso === 3) { // derecha
    
    image(
      spriteOso,
      px,
      py,
      cellSize,
      cellSize,
      frameActual * frameWidth,
      3 * frameHeight,   // fila derecha
      frameWidth,
      frameHeight
    );
  }
  else {
    
    image(
      spriteOso,
      px,
      py,
      cellSize,
      cellSize,
      frameActual * frameWidth,
      direccionOso * frameHeight,
      frameWidth,
      frameHeight
    );
  }
  
  pop();
  
  // Resetear el flag de movimiento para el siguiente frame
  jugadorMoviendose = false;

  fill(0);
  textSize(16);
  textAlign(CENTER, BOTTOM);
  text("🍂 Haz que todas las manzanas lleguen a los arboles 🍂", width/2, height-5);
}

// ================= MOVIMIENTO =================
// El movimiento continuo con teclado se maneja en draw() usando keyIsDown()
function mousePressed() {
  // Calcular la dirección desde el jugador hacia el mouse
  let jugadorX = playerX * cellSize + cellSize / 2;
  let jugadorY = playerY * cellSize + cellSize / 2;
  
  let dx = mouseX - jugadorX;
  let dy = mouseY - jugadorY;
  
  // Determinar la dirección principal
  if (Math.abs(dx) > Math.abs(dy)) {
    direccionMouseX = dx > 0 ? 1 : -1;
    direccionMouseY = 0;
  } else {
    direccionMouseX = 0;
    direccionMouseY = dy > 0 ? 1 : -1;
  }
  
  mouseMoviendo = true;
  ultimoMovimiento = millis();
  mover(direccionMouseX, direccionMouseY);
}

function mouseReleased() {
  mouseMoviendo = false;
}

// Agregar listeners al window para mayor compatibilidad
window.addEventListener('mouseup', function() {
  mouseMoviendo = false;
});

function mover(dx, dy) {
  // Actualizar dirección del oso
  if (dy < 0) direccionOso = 1;      // Arriba
  else if (dy > 0) direccionOso = 0; // Abajo
  else if (dx < 0) direccionOso = 2; // Izquierda
  else if (dx > 0) direccionOso = 3; // Derecha
  
  jugadorMoviendose = true;

  if (Song1 && Song1.isLoaded() && !sonidoReproducido) {
    Song1.play();
    Song1.onended(reproducirNuevamente);
    sonidoReproducido = true;
  }

  let nx = playerX + dx;
  let ny = playerY + dy;

  let siguiente = leerCelda(ny, nx);
  let dosAdelante = leerCelda(ny + dy, nx + dx);

  if (siguiente === VACIO || siguiente === ARBOL) {
    // El jugador puede caminar sobre espacios vacíos o árboles
    playerX = nx;
    playerY = ny;
  }
  else if (siguiente === MANZANA || siguiente === HOJAS) {

    if (dosAdelante === VACIO || dosAdelante === ARBOL) {

      // mover objeto - ahora invertimos la lógica
      objetos[ny + dy][nx + dx] =
        (siguiente === MANZANA && suelo[ny + dy][nx + dx] === ARBOL)
          ? HOJAS
          : siguiente;

      objetos[ny][nx] = null;

      playerX = nx;
      playerY = ny;
    }
  }
  
  ganar();
}

function leerCelda(f, c) {
  // Validar que f y c sean números válidos
  if (isNaN(f) || isNaN(c)) return PARED;
  if (f < 0 || f >= gridHeight || c < 0 || c >= gridWidth) return PARED;

  // Verificar que las coordenadas existan en el array (no undefined ni null)
  if (suelo[f] === undefined || suelo[f][c] === undefined || suelo[f][c] === null) return PARED;
  if (suelo[f][c] === PARED) return PARED;

  if (objetos[f] && objetos[f][c] != null) return objetos[f][c];

  return suelo[f][c];
}

// ================= GANAR =================
function ganar() {
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      if (suelo[i][j] === ARBOL && objetos[i][j] !== HOJAS) {
        return;
      }
    }
  }

  opcion++;
  if (opcion > nivelesData.length) {
    // Marcar juego como terminado
    juegoTerminado = true;
    return;
  }

  cargarNivel();
}

// ================= BOTONES =================
function botones() {
  let panel = document.getElementById('panel-lateral');
  let toggleBtn = document.getElementById('toggle-panel');
  let btnReiniciar = document.getElementById('btn-reiniciar');
  let btnAnterior = document.getElementById('btn-anterior');
  
  if (!panel || !toggleBtn) return;
  
  // Toggle del panel
  toggleBtn.addEventListener('click', function() {
    panel.classList.toggle('panel-cerrado');
    panel.classList.toggle('panel-abierto');
  });
  
  // Botón reiniciar
  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', function() {
      cargarNivel();
    });
  }
  
  // Botón anterior
  if (btnAnterior) {
    btnAnterior.addEventListener('click', function() {
      if (opcion > 1) {
        opcion--;
        cargarNivel();
      }
    });
  }
}

// ================= RESPONSIVE =================
function windowResized() {
  resizeCanvas(gridWidth * cellSize, gridHeight * cellSize + 40);
  entorno();
}