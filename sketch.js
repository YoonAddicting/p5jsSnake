// https://www.youtube.com/watch?v=AaGK-fj-BAM

var snake;
var crunch;
var volSlider;
var scl = 20;
var speed = 10;

function preload() {
    crunch = loadSound("crunch.mp3");
}

function setup() {
    createCanvas(800,800);
    snake =  new Snake;
    var volControls = document.getElementById("volControls");
    volSlider = createSlider(0,1,0.5,0.01).id("volSlider").parent("volControls");
    frameRate(15);
    pickLocation();
}

function pickLocation() {
    var cols = floor(width/scl);
    var rows = floor(height/scl);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scl);
}

function draw() {
    background(50);
    snake.death();
    snake.update();
    snake.show();
    
    if (snake.eat(food)) {
        pickLocation();
    };
    
    fill(255, 0, 100);
    rect(food.x,food.y,scl,scl);
    crunch.setVolume(volSlider.value());
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        if (snake.yspeed == 1) {
          snake.dir(0, 1);
        } else {
          snake.dir(0, -1);
        }
    } else if (keyCode === DOWN_ARROW) {
        if (snake.yspeed == -1) {
          snake.dir(0, -1);
        } else {
          snake.dir(0, 1);
        }
    } else if (keyCode === LEFT_ARROW) {
        if (snake.xspeed == 1) {
          snake.dir(1,0);
        } else {
          snake.dir(-1,0);
        }
    } else if (keyCode === RIGHT_ARROW) {
        if (snake.xspeed == -1) {
          snake.dir(-1,0);
        } else {
          snake.dir(1,0);
        }
    }
}

function Snake() {
    this.x = width/2;
    this.y = height/2;
    this.xspeed = 0;
    this.yspeed = 0;
    this.total = 0;
    this.hiscore = checkCookie();
    this.played = 0;
    textAlign(CENTER);
    this.gameText = "";
    this.tail = [];
    
    this.dir = function(x, y) {
        this.played = 1;
        this.xspeed = x;
        this.yspeed = y;
    }
    
    this.eat = function(pos) {
        var d = dist(this.x, this.y, pos.x, pos.y);
        if (d < 1) {
            this.total ++;
            crunch.setVolume(0.1);
            crunch.play();
            return true;
        } else {
            return false;
        }
    }
    
    this.death = function() {
        for (var i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1) {
                // Stuff to do when dying
                if (this.total*10 > this.hiscore) {
                  Cookies.set('hiScore',this.total*10);
                }
                this.total = 0;
                this.tail = [];
                this.x=width/2;
                this.y=height/2;
                this.dir(0,0);
                this.played = 2;
                this.hiscore = Cookies.get('hiScore');
                // https://www.w3schools.com/js/js_cookies.asp
                // Check if any cookie is set, if not, set one, if one is set, load it, compare the score of the cookie to the score of the current game, and save the highest value to the cookie.
            }
        }
    }
    
    this.update = function() {
        if (this.total === this.tail.length) {
            for (var i = 0; i < this.tail.length-1; i++) {
                this.tail[i] = this.tail[i+1];
            }        
        }
        this.tail[this.total-1] = createVector(this.x,this.y);
        
        this.x = this.x + this.xspeed*scl;
        this.y = this.y + this.yspeed*scl;
        
        this.x = constrain(this.x,0,width-scl);
        this.y = constrain(this.y,0,height-scl);
        if (this.played == 0) {
          this.gameText = "Welcome! Press an arrow key to begin!";
        } else if (this.played == 1) {
          this.gameText = "";
        } else if (this.played == 2) {
          this.gameText = "GAME OVER - Press an arrow key to try again!";
        }
    }
    
    this.show = function() {
        fill(255);
        for (var i = 0; i < this.tail.length; i++) {
            rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }
        rect(this.x,this.y,scl,scl);
        this.textSize = 16;
        textSize(this.textSize);
        textAlign(LEFT);
        text("Score: " + this.total*10,10,30);
        text("Hi-score: " + this.hiscore,width-110,30);
        textAlign(CENTER);
        text(this.gameText,width/2,height/2-300);
    }
}

//Function to check if cookie "hiScore" exists, and loads it, else creates it with value of 0.
function checkCookie() {
    var hiScore = Cookies.get('hiScore');
    if (typeof hiScore != 'undefined') {
        return Cookies.get('hiScore');
    } else {
        Cookies.set('hiScore', 0);
        return Cookies.get('hiScore');
    }
}

