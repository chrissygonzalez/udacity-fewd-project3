// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.start();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // rest bug once it goes off screen
    if (this.x < 505 + 110) {
        this.x += this.speed * dt;
        this.render();
    } else {
        this.start();
    }
}

Enemy.prototype.start = function() {
    // start the bugs off-screen
    var howFarLeft = Math.floor(Math.random() * (450 - 110)) + 450 + 1;
    this.x = -howFarLeft;

    // top row is 60, middle row is 143, bottom row is 226
    var rowPosition = [60, 143, 226];
    var whichRow = Math.floor(Math.random() * 3);
    this.y = rowPosition[whichRow];

    // set a random bug speed
    this.speed = Math.floor(Math.random() * (600 - 350)) + 200 + 1;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-pink-girl.png';
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {

}

Player.prototype.handleInput = function() {

}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// TODO generate random number of bugs and push to allEnemies automatically
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3];
console.log('allEnemies: ' + allEnemies);

var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
