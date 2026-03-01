let nave;
let enemigos = [];
let balas = [];
let explosiones = [];
let balasEnemigas = [];
let estrellas = [];
let puntos = 0;
let nivel = 0;
let vidas = 3;
let timerPausa = 0;
let enPausa = false;

// Variables de Imágenes
let imgNave;
let imgEnemigoNormal;
let imgEnemigoEspecial;
let imgExplosion; 

// Variables de sonido
let sonidoDisparo;
let musicaFondo;
let explosion;

let estado = 'INICIO'; 
let coloresNiveles = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FFFF33'];

function preload() {
    imgNave = loadImage('assets/space__0006_Player.png');
    imgEnemigoNormal = loadImage('assets/space__0001_A2.png');
    imgEnemigoEspecial = loadImage('assets/space__0000_A1.png');
    imgExplosion = loadImage('assets/space__0009_EnemyExplosion.png'); 

    sonidoDisparo = loadSound('assets/shoot.wav');
    musicaFondo = loadSound('assets/backgroundMusic.mp3');
    explosion = loadSound('assets/explosion.wav');
}

function setup() {
    userStartAudio();
    createCanvas(600, 400);
    nave = new Nave();
    crearEnemigos();

    for (let i = 0; i < 100; i++) {
        estrellas.push({
            x: random(width),
            y: random(height),
            velocidad: random(0.5, 2),
            size : random(1, 3)
        });
    }
}

function draw() {
    background(0);

    if (estado === 'INICIO') {
        pantallaInicio();
    } else if (estado === 'JUGANDO') {
        dibujarFondoEspacial();
        ejecutarLogicaJuego();
    } else if (estado === 'GAMEOVER') {
        pantallaGameOver();
    }
}

function ejecutarLogicaJuego() {
    // --- 1. UI ---
    dibujarInterfaz();

    // --- 2. SISTEMA DE PAUSA ---
    if (enPausa) {
        if (millis() - timerPausa > 250) {
            enPausa = false;
        }
        if (frameCount % 10 < 5) background(50, 0, 0); 
        return; 
    }

    // --- 3. DISPAROS ENEMIGOS ---
    if (frameCount % 60 === 0 && enemigos.length > 0) {
        let enemigoRandom = random(enemigos);
        balasEnemigas.push(enemigoRandom.shoot()); 
    }

    // --- 4. MANEJO DE BALAS ENEMIGAS ---
    for (let i = balasEnemigas.length - 1; i >= 0; i--) {
        balasEnemigas[i].show();
        balasEnemigas[i].movement();

        if (balasEnemigas[i].hits(nave)) {
            balasEnemigas.splice(i, 1);
            perderVidas();
            activarPausa();
            continue; 
        }
        if (balasEnemigas[i].y > height) {
            balasEnemigas.splice(i, 1);
        }
    }

    // --- 5. NAVE ---
    nave.movement();
    nave.show();

    // --- 6. ENEMIGOS ---
    let tocoBorde = false;
    for (let e of enemigos) {
        e.show();
        e.movement();
        if (e.x + e.r > width || e.x - e.r < 0) tocoBorde = true;
        if (e.y + e.r > height - 40) gameOver();
    }

    if (tocoBorde) {
        for (let e of enemigos) e.bajar();
    }

    // --- 7. MANEJO DE BALAS DEL JUGADOR (CORREGIDO) ---
    for (let i = balas.length - 1; i >= 0; i--) {
        balas[i].show();
        balas[i].movement();
        let haImpactado = false; // Variable de control única

        for (let j = enemigos.length - 1; j >= 0; j--) {
            if (!haImpactado && balas[i].hit(enemigos[j])) {
                puntos += 10;
                explosiones.push({
                    x: enemigos[j].x,
                    y: enemigos[j].y,
                    timer: 10 
                });

                enemigos.splice(j, 1);
                haImpactado = true; // Bloquea la bala para que no atraviese
                break; 
            }
        }
        
        if (haImpactado) {
            balas.splice(i, 1);
        } else if (balas[i] && balas[i].y < 0) {
            balas.splice(i, 1);
        }
    }

    // --- 8. EXPLOSIONES ---
    for (let i = explosiones.length - 1; i >= 0; i--) {
        let exp = explosiones[i];
        imageMode(CENTER);
        image(imgExplosion, exp.x, exp.y, 30, 30);
        explosion.play(0.3);
        exp.timer--;
        if (exp.timer <= 0) explosiones.splice(i, 1);
    }

    // --- 9. CAMBIO DE NIVEL ---
    if (enemigos.length === 0) {
        nivel++;
        crearEnemigos();
    }
}

// --- FUNCIONES DE SOPORTE ---

function dibujarInterfaz() {
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text("SCORE: " + nf(puntos, 6), 20, 20);
    for (let i = 0; i < vidas; i++) {
        corazon(width - 40 - (i * 30), 25, 15);
    }
}

function crearEnemigos() {
    let rows = 5;
    let cols = 11;
    let colorActual = coloresNiveles[nivel % coloresNiveles.length];
    let velocidadNivel = 1 + (nivel * 0.2); 
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * 40 + 60;
            let y = j * 30 + 60;
            let tipo = (j === 0) ? 'especial' : 'normal';
            enemigos.push(new Enemigo(x, y, colorActual, tipo, velocidadNivel));
        }
    }
}

function keyPressed() {
    // Control de Menús
    if (estado === 'INICIO' || estado === 'GAMEOVER') {
        if (keyCode === ENTER) {
            reiniciarJuegoCompleto();
            estado = 'JUGANDO';

            if (!musicaFondo.isPlaying()) {
                musicaFondo.loop();
                musicaFondo.setVolume(0.5); 
            }
        }
    }

    // Control de Juego 
    if (estado === 'JUGANDO' && !enPausa) {
        if (key === ' ') {
            balas.push(new Bala(nave.x, height - 35));
            sonidoDisparo.play();
            sonidoDisparo.setVolume(0.2);
        }
        if (keyCode === RIGHT_ARROW) nave.setDir(1);
        else if (keyCode === LEFT_ARROW) nave.setDir(-1);
    }
}

function keyReleased() {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
        nave.setDir(0);
    }
}

function reiniciarJuegoCompleto() {
    puntos = 0;
    vidas = 3;
    nivel = 0;
    enemigos = [];
    balas = [];
    balasEnemigas = [];
    explosiones = []; // Limpiar explosiones viejas
    crearEnemigos();
}

function perderVidas() {
    vidas--;
    if (vidas <= 0) gameOver();
}

function gameOver() {
    estado = 'GAMEOVER';
}

function activarPausa() {
    enPausa = true;
    timerPausa = millis();
}

function corazon(x, y, size) {
    fill(255, 0, 0);
    noStroke();
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}

function pantallaInicio() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("SPACE INVADERS", width / 2, height / 2 - 20);
    textSize(20);
    fill(0, 255, 0);
    text("Presiona ENTER para comenzar", width / 2, height / 2 + 40);
}

function pantallaGameOver() {
    background(50, 0, 0); 
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("GAME OVER", width / 2, height / 2 - 30);
    textSize(25);
    text("Puntaje Final: " + puntos, width / 2, height / 2 + 20);
    textSize(15);
    fill(200);
    text("Presiona ENTER para reintentar", width / 2, height / 2 + 70);
}

function dibujarFondoEspacial() {
    background(5, 5, 20);

    fill(255);
    noStroke();

    for (let estrella of estrellas) {

        rect(estrella.x, estrella.y, estrella.size, estrella.size);

        estrella.y += estrella.velocidad;

        if (estrella.y > height){
            estrella.y = 0;
            estrella.x = random(width);
        }
    }
}