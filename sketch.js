// Initializes the variables

var snake;
var crunch;
var volSlider;
var scl = 20;
var resetButton;
var cookieReset = 0;

// Loads the crunch.mp3 file before continuing to load the program
function preload() {
  crunch = loadSound("crunch.mp3");
}

// Initializes the game-frame.
function setup() {
  // Sets the size to 800px x 800px
  createCanvas(800, 800);
  // Makes a volume slider as a child of the volControls element.
  var volControls = document.getElementById("volControls");
  volSlider = createSlider(0, 1, 1, 0.01).id("volSlider").parent("volControls");
  // Makes a button for reseting the high-score by deleting the cookie when clicked.
  var resetButtonDiv = document.getElementById("resetButtonDiv");
  resetButton = createButton('Reset hi-score').id("resetButton").parent("resetButtonDiv");
  resetButton.mousePressed(deleteCookie);
  // Makes a new snake element
  snake = new Snake;
  // Sets the framerate to 15 frames per second
  frameRate(15);
  // Finds a new location for the food
  pickLocation();
}

// Finds a new location for the food
function pickLocation() {
  // The location must be on a grid, divisable by the scale of the game, in this case 20, so the food spawns on places where the snake can be.
  var cols = floor(width / scl);
  var rows = floor(height / scl);
  // Pics a random location, meeting this criteria
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

// function which runs once every frame.
function draw() {
  // paints the background first
  background(60);
  // Checks if the snake should die
  snake.death();
  // Updates the position
  snake.update();
  // shows the updated location
  snake.show();
  // If the snakes location is the same as the foods location, then a new food should be generated
  if (snake.eat(food)) {
    pickLocation();
  }
  // fills the snake with a color
  fill(255, 0, 100);
  // draws the snake
  rect(food.x, food.y, scl, scl);
  // reads the volume set by the slider
  crunch.setVolume(volSlider.value());
}

// Controlls
function keyPressed() {
  // Makes the snake go up, if the up arrow is pressed, unless if its going down, then it'll continue to go down.
  if (keyCode === UP_ARROW) {
    if (snake.yspeed == 1) {
      snake.dir(0, 1);
    }
    else {
      snake.dir(0, -1);
    }
  }
  // Makes the snake go down, if the down arrow is pressed, unless if its going up, then it'll continue to go up.
  else if (keyCode === DOWN_ARROW) {
    if (snake.yspeed == -1) {
      snake.dir(0, -1);
    }
    else {
      snake.dir(0, 1);
    }
  }
  // Makes the snake go left, if the left arrow is pressed, unless if its right down, then it'll continue to go right.
  else if (keyCode === LEFT_ARROW) {
    if (snake.xspeed == 1) {
      snake.dir(1, 0);
    }
    else {
      snake.dir(-1, 0);
    }
  }
  // Makes the snake go right, if the right arrow is pressed, unless if its going left, then it'll continue to go left.
  else if (keyCode === RIGHT_ARROW) {
    if (snake.xspeed == -1) {
      snake.dir(-1, 0);
    }
    else {
      snake.dir(1, 0);
    }
  }
}

// Snake-object
function Snake() {
  // Start position is in the center, which is both the width and height divided by 2.
  this.x = width / 2;
  this.y = height / 2;
  // Start speed is 0,0
  this.xspeed = 0;
  this.yspeed = 0;
  // Start score is 0
  this.total = 0;
  // Loads the cookie, to see if there's a high-score
  this.hiscore = checkCookie();
  // Sets status to not-played
  this.played = 0;
  // Aligns game text in center
  textAlign(CENTER);
  this.gameText = "";
  // Initializes the snake's tail array
  this.tail = [];
  // Sets the snakes direction to the speed of the snake. Only one of the axises can be non-zero at a time (it can only move vertical and horizontal)
  this.dir = function (x, y) {
    // Sets the game to started and ongoing
    this.played = 1;
    this.xspeed = x;
    this.yspeed = y;
  }
  // Checks whether the snake eats a piece of food, which it does, if the distance between the snake and food is less than 0. In that case, it increases the score, and plays the crunch sound.
  this.eat = function (pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      crunch.setVolume(0.1);
      crunch.play();
      return true;
    }
    else {
      return false;
    }
  }
  // Checks whether the snake dies, if a part of it's tail is located the same place as it's head.
  this.death = function () {
    for (var i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      // If the snake dies, it will save the score as the new high-score, if it's higher than the old one, and reset the round dependant variables back to 0 (Score, tail, location, speed) and will set game status to 2, so it displays the gameover text, and loads the high-score once again.
      if (d < 1) {
        if (this.total * 10 > this.hiscore) {
          Cookies.set('hiScore', this.total * 10);
        }
        this.total = 0;
        this.tail = [];
        this.x = width / 2;
        this.y = height / 2;
        this.dir(0, 0);
        this.played = 2;
        this.hiscore = Cookies.get('hiScore');
      }
    }
  }
  this.update = function () {
    // Shifts the position of the tail down 1, every time the snake moves.
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    // Stores the position of the snake's tail.
    this.tail[this.total - 1] = createVector(this.x, this.y);
    // Positions the snake in the game, according to it's speed
    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;
    // Restrains the snake to the boundaries of the game.
    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
    // If game status is 0 (just loaded), then show the following text.
    if (this.played == 0) {
      this.gameText = "Welcome! Press an arrow key to begin!";
    }
    // If game status is 1 (On-going), then show no text.
    else if (this.played == 1) {
      this.gameText = "";
    }
    // If game status is 2 (game over), the show the following text.
    else if (this.played == 2) {
      this.gameText = "GAME OVER - Press an arrow key to try again!";
    }
  }
  //
  this.show = function () {
    // Fills the snake with white
    fill(255);
    // Draws the snake's tail.
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    // Draws the snake's head.
    rect(this.x, this.y, scl, scl);
    // Sets the text size to 16.
    this.textSize = 16;
    textSize(this.textSize);
    // Sets font to Verdana and alignment to left.
    textFont("Verdana");
    textAlign(LEFT);
    // Prints the score of the player at the coordinates x=10, y=30
    text("Score: " + this.total * 10, 10, 30);
    // If the reset cookie button is pressed, create new cookie with score of 0.
    if (cookieReset == 1) {
      this.hiscore = Cookies.get('hiScore');
    }
    // Shows hiscore at x= width-120, y=30
    text("Hi-score: " + this.hiscore, width - 120, 30);
    // Shows game text in the center, 300 px above the center of the height.
    textAlign(CENTER);
    text(this.gameText, width / 2, height / 2 - 300);
  }
}
//Function to check if cookie "hiScore" exists, and loads it, else creates it with value of 0.
function checkCookie() {
  var hiScore = Cookies.get('hiScore');
  if (typeof hiScore != 'undefined') {
    return Cookies.get('hiScore');
  }
  else {
    Cookies.set('hiScore', 0);
    return Cookies.get('hiScore');
  }
}
// Runs if deleteCookie button is pressed, and deletes the cookie.
function deleteCookie() {
  Cookies.set('hiScore',0);
  cookieReset = 1;
}
