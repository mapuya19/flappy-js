// Objects
let tubes;
let bird;
let scoreBoard;

// Font
let f;

// Sounds
let point;
let wing;
let hit;
let die;

// Global Variables
var windowW = 500;
var windowH = 600;

var gravity = 0.2;

var birdX = windowW / 2;
var birdY = windowH / 2;
var birdRadius = 10;

var birdJumpSpeed = 10;
var birdVelocity = 0;

var birdJump;
var birdAlive = true;

var topTube, topTube2;
var bottomTube, bottomTube2;
var tubeX = 500;
var tubeGap = 80;
var tubeWidth = 100;
var tubeMinimum = 150;

var score;
var scoreX = windowW / 2;
var scoreY = 60;

var endSoundPlayed;

function preload() {
  soundFormats('mp3', 'wav');
  point = loadSound('assets/point.wav');
  wing = loadSound('assets/wing.mp3');
  hit = loadSound('assets/hit.mp3');
  die = loadSound('assets/die.mp3');
}

function setup() {
  createCanvas(windowW, windowH);
  background(0, 0, 0);
  f = loadFont('assets/flappy-font.ttf'); // flappy-font

  textAlign(CENTER, BOTTOM);

  bird = new Bird(birdX, birdY);
  tubes = new Tubes(tubeX);
  scoreBoard = new Score();

  // Reset global variable values every time setup() is called (For game restart)
  score = 0;
  scoreX = windowW / 2;

  birdJumpSpeed = 10;
  birdVelocity = 0;
  birdAlive = true;
  birdJump = false;

  endSoundPlayed = false;
}

function draw() {
  background(204, 255, 255);
  
  tubes.draw();
  bird.draw();
  scoreBoard.draw();

  tubes.update();
  bird.update();
  scoreBoard.update();
  
  bird.collisionCheck();
}

function mousePressed() {
  if (birdAlive) {
    birdJump = true;
    wing.play();
  }
}

function mouseReleased() {
  if (birdAlive) {
    birdJump = false;
  }
}

function keyPressed() {
  // Unable to prevent key repeat due to OS restrictions
  if (key == ' ' && birdAlive) {
    birdJump = true;
    wing.play();
  }

  if (keyCode  == DOWN_ARROW) {
    loop();
    setup();
  }
}

function keyReleased() {
  if (key == ' ' && birdAlive) {
    birdJump = false;
  }
}

function restartScreen() {
  // Only play end sound once per setup()
  if (endSoundPlayed == false) {
    hit.play();
    die.play();
    endSoundPlayed = true;
  }

  textFont(f,32);
  textAlign(CENTER, BOTTOM);
  fill(255, 255, 255);
  text("You lose! Press DOWN to restart.", width / 2, height / 2);
  fill(255, 255, 255);

  if (this.posY >= height - birdRadius) {
    noLoop();
  }
}

class Bird {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
  }
  
  // Draw bird
  draw() {
    stroke(0);
    fill(255,230,102);
    ellipse(150, this.posY, birdRadius * 2, birdRadius * 2);
  }

  // Gravity force on Bird unless Bird is alive AND space bar is pressed
  update() {
    birdVelocity += gravity;
    this.posY = this.posY + birdVelocity;

    if (birdAlive && birdJump) {
      if (birdVelocity > -2) {
        birdVelocity = -3.5;
      }
    }

    // Make sure Bird doesn't go above window
    this.posY = constrain(this.posY, 0 + birdRadius, height);
  }

  // If bird hits tubes or ground, call restartScreeen();
  collisionCheck() {
    if (this.posY >= height - birdRadius) {
      birdAlive = false;
      restartScreen();
    }

    if((tubes.posX + (birdRadius * 6) > tubeWidth) && (tubes.posX - (birdRadius * 6) < tubeWidth)) {  
      if ((this.posY + (birdRadius) > bottomTube) || (this.posY - birdRadius < topTube)) {
        birdAlive = false;
        restartScreen();
      }
    }

    if((tubes.posX2 + (birdRadius * 6) > tubeWidth) && (tubes.posX2 - (birdRadius * 6) < tubeWidth)) {  
      if ((this.posY + (birdRadius) > bottomTube2) || (this.posY - birdRadius < topTube2)) {
        birdAlive = false;
        restartScreen();
      }
    }
  }
}

class Score {
  // Empty default constructor; can be updated later for more specific use cases
  constructor() {
    
  }

  draw() {
    textFont(f,64);
    fill(255, 255, 255);
    text("Score: " + score, scoreX, scoreY);
  }

  update() {
    if (birdAlive) {
      if (bird.posX == (tubes.posX + (tubeWidth)) || bird.posX == (tubes.posX2 + (tubeWidth))) {
        score++;
        point.play();
      }
    }
  }
}

class Tubes {
  constructor (x) {
      // First set of tubes
      topTube = random(150, windowH - tubeMinimum);
      bottomTube = topTube + tubeGap;
      this.posX = x;

      // Second set of tubes
      topTube2 = random(150, windowH - tubeMinimum);
      bottomTube2 = topTube2 + tubeGap;
      this.posX2 = x + 300;
  }

  draw() {
      fill(136, 204, 0);

      // Draw first set of tubes
      rect(this.posX, 0, tubeWidth, topTube);
      rect(this.posX, bottomTube, tubeWidth, windowH);

      // Draw second set of tubes
      rect(this.posX2, 0, tubeWidth, topTube2);
      rect(this.posX2, bottomTube2, tubeWidth, windowH);
  }

  update() {
    // If bird is alive, move existing tubes and generate new ones as necessary
    if (birdAlive) {
      this.posX = this.posX - 2;
      this.posX2 = this.posX2 - 2;

      if (this.posX + tubeWidth < 0) {
          topTube = random(150, windowH - tubeMinimum);
          bottomTube = topTube + tubeGap;
          this.posX = 500;
      }

      if (this.posX2 + tubeWidth < 0) {
          topTube2 = random(150, windowH - tubeMinimum);
          bottomTube2 = topTube2 + tubeGap;
          this.posX2 = 500;
      }
    }
  }
}