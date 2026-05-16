let spriteSheet, spriteSheet2, spriteSheet3;
let gameFont, imgFondo;
let customerSprite;
let playerThrow;
let beerThrown;
let customerDrinkingSprite;
let bartenderRun;
let bartenderScared;
let bartenderChange;
let cervezaCaida;
let particles;
let beerEmpty;
let beerEmptyCaida;
let music;

function preloadAssets() {
  spriteSheet = loadImage("sprites/bartender_idle.png");
  spriteSheet2 = loadImage("sprites/bartender_drinking.png");
  spriteSheet3 = loadImage("sprites/bartender_win.png");
  gameFont = loadFont("fonts/font_arcade.TTF");
  imgFondo = loadImage("sprites/tapper_fondo.png");
  customerSprite = loadImage("sprites/customers.png");
  playerThrow = loadImage("sprites/playerThrow.png")
  beerThrown = loadImage("sprites/beerThrown.png")
  customerDrinkingSprite = loadImage("sprites/CustomersDrinking.png");
  bartenderRun = loadImage("sprites/bartender_run.png");
  bartenderScared = loadImage("sprites/bartender_scared.png");
  bartenderChange = loadImage("sprites/bartender_change.png");
  cervezaCaida = loadImage("sprites/cerveza_caida.png");
  particles = loadImage("sprites/particles.png");
  beerEmpty = loadImage("sprites/beerEmpty.png");
  beerEmptyCaida = loadImage("sprites/beerEmptyCaida.png");
  music = loadSound("TapperMusic.mp3");
}
