//*****************************
// Enemies
//*****************************

// Enemies our player must avoid
var Enemy = function() {
    // image for bugs
    this.sprite = 'images/enemy-bug.png';

    this.start();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // reset bug once it goes off screen
    if (this.x < 505 + 110) {
        this.x += this.speed * dt;
        //this.render();
    } else {
        this.start();
    }
}

Enemy.prototype.start = function() {
    // start the bugs off-screen at a distance between -450 and -110
    var leftOffset = Math.floor(Math.random() * (450 - 110)) + 450 + 1;
    this.x = -leftOffset;

    // the three bug rows
    var firstRow = 60;
    var secondRow = 143;
    var thirdRow = 226;

    var rows = [firstRow, secondRow, thirdRow];
    var whichRow = Math.floor(Math.random() * 3);
    this.y = rows[whichRow];

    // set a random bug speed
    this.speed = Math.floor(Math.random() * (600 - 350)) + 200 + 1;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


//*****************************
// Players
//*****************************

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 322;
}

Player.prototype.update = function(key) {
    // width of column, height of row
    var colWidth = 101;
    var rowHeight = 83;

    // keeps player within canvas
    if (key === 'left' && this.x > 0) {
        this.x -= colWidth;
    } else if (key === 'right' && this.x < 404) {
        this.x += colWidth;
    } else if (key === 'up' && this.y > 10) {
        this.y -= rowHeight;
    } else if (key === 'down' && this.y < 405) {
        this.y += rowHeight;
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.reset = function() {
    this.x = 202;
    this.y = 322;
}

Player.prototype.handleInput = function(key) {
    if(key) {
        this.update(key);
    }
}

//*****************************
// Gems
//*****************************

var Gem = function() {
    this.sprite = 'images/gem-orange.png';
    this.position();
}

Gem.prototype.position = function() {
    var rows = [83, 166, 249, 332, 415];
    var columns = [0, 101, 202, 303, 404];
    var random1 = Math.floor(Math.random() * 5);
    var random2 = Math.floor(Math.random() * 5);

    console.log(random1 + ', ' + random2);

    this.x = columns[random1];
    this.y = rows[random2]
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var gem = new Gem();

//*****************************
// Instantiate everything
//*****************************

var allEnemies = [];
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
allEnemies.push(enemy1, enemy2, enemy3);

var player = new Player();


//*****************************
// Listen for keyboard
//*****************************

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//*****************************
// Detect collisions
//*****************************

function checkCollisions() {
    for (var i=0; i<allEnemies.length; i++) {
        if(player.x < allEnemies[i].x + 101 &&
            player.x > allEnemies[i].x &&
            player.y > allEnemies[i].y &&
            player.y < allEnemies[i].y + 83) {
            player.reset();
        }
    }
}
