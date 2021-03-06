//*****************************
// Enemies
//*****************************

// sets image, calls init to set up a bug
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.init();
};

// sets random starting position and speed for bug
Enemy.prototype.init = function() {
    // positions the bug off-screen at a distance between -450 and -110
    var leftOffset = Math.floor(Math.random() * (450 - 110)) + 450 + 1;
    this.x = -leftOffset;

    // chooses a row randomly
    var FIRSTROW = 60;
    var SECONDROW = 143;
    var THIRDROW = 226;

    var rows = [FIRSTROW, SECONDROW, THIRDROW];
    var whichRow = Math.floor(Math.random() * 3);
    this.y = rows[whichRow];

    // sets a random bug speed
    this.speed = Math.floor(Math.random() * (600 - 350)) + 200 + 1;
};

// draws the bug
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// changes bug position, resets once it goes off screen
Enemy.prototype.update = function(dt) {
    if (this.x < 505 + 110) {
        // move bug
        this.x += this.speed * dt;
    } else {
        // reset bug
        this.init();
    }
};

// start all enemies over
Enemy.prototype.resetEnemies = function() {
     allEnemies.forEach(function(enemy) {
        enemy.init();
     });
};

//*****************************
// Players
//*****************************

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.reset();

    // sets the player's score and available lives
    this.currentScore = 0;
    this.lives = 5;
};

// puts player in starting position
Player.prototype.reset = function() {
    this.x = 202;
    this.y = 322;
};

// draws player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// if the key is allowed, calls update, checks for score changes
Player.prototype.handleInput = function(key) {
    if(key !== undefined) {
        this.update(key);
        this.score();
    }
};

// allows player to move if not at edge of canvas
Player.prototype.update = function(key) {
    // width of column, height of row
    var COL_WIDTH = 101;
    var ROW_HEIGHT = 83;

    // keeps player within canvas
    if (key === 'left' && this.x > 0) {
        this.x -= COL_WIDTH;
    } else if (key === 'right' && this.x < 404) {
        this.x += COL_WIDTH;
    } else if (key === 'up' && this.y > 10) {
        this.y -= ROW_HEIGHT;
    } else if (key === 'down' && this.y < 405) {
        this.y += ROW_HEIGHT;
    }
};

// check for collisions with enemies (gem collisions handled by Player gemScore)
Player.prototype.checkCollisions = function() {
    var collisionSound = document.getElementById('collision');
    allEnemies.forEach(function(enemy) {
        var playerX = player.x + 17,
            playerY = player.y + 59,
            PLAYER_WIDTH = 67,
            PLAYER_HEIGHT = 83,
            enemyX = enemy.x,
            enemyY = enemy.y + 73,
            ENEMY_WIDTH = 101,
            ENEMY_HEIGHT = 67;
        if(playerX < enemyX + ENEMY_WIDTH &&
            playerX + PLAYER_WIDTH > enemyX &&
            playerY < enemyY + ENEMY_HEIGHT &&
            playerY + PLAYER_HEIGHT > enemyY) {
            player.reset();
            player.loseLife();
            collisionSound.play();
        }
    });
};

// make reset button visible and clickable
Player.prototype.showReset = function() {
    var resetButton = document.getElementById('reset');
    resetButton.style.display = 'block';
    return resetButton;
};

Player.prototype.hideReset = function() {
    var resetButton = document.getElementById('reset');
    resetButton.style.display = 'none';
};

//*****************************
// Players -- Scoring
//*****************************

// increases score if warranted, called by game loop
Player.prototype.score = function() {
    this.gemScore();
    this.waterScore();
    return this.currentScore;
};

Player.prototype.resetScore = function() {
    this.currentScore = 0;
};

// 10 points for hitting a gem
Player.prototype.gemScore = function() {
    var gemSound = document.getElementById('gem');
    if(this.x === gem.x &&
    (this.y) === gem.y) {
        this.currentScore +=10;
        gemSound.play();
        gem.hideGem();
    }
};

// 50 points for reaching the water
Player.prototype.waterScore = function() {
    var successSound = document.getElementById('success');
    if(this.y === -10) {
        successSound .play();
        this.currentScore += 50;
        this.reset();
    }
};

//*****************************
// Players -- Lives
//*****************************

// called by updateEntities > updateLives, powers on-screen score
Player.prototype.howManyLives = function() {
    return this.lives;
};

// called by checkCollisions
Player.prototype.loseLife = function() {
    this.lives -= 1;
};

Player.prototype.resetLives = function() {
    this.lives = 5;
};

//*****************************
// Gems
//*****************************

var Gem = function() {
    this.sprite = 'images/gem-orange.png';

    // start with gem not showing
    this.showing = false;

    // counter controls timing of gem appearance/disappearance
    this.counter = 0;
};

// show if showing, hide if hidden
Gem.prototype.position = function() {
    if (this.showing === false) {
        this.showGem();
    } else {
        this.hideGem();
    }
};

Gem.prototype.showGem = function() {
    var rows = [83, 166, 249, 332, 415];
    var columns = [0, 101, 202, 303, 404];
    var random1 = Math.floor(Math.random() * 5);
    var random2 = Math.floor(Math.random() * 5);

    this.x = columns[random1];
    this.y = rows[random2] - 10;
    this.showing = true;
};

Gem.prototype.hideGem = function() {
    this.x = -200;
    this.y = -200;
    this.showing = false;
};

Gem.prototype.update = function() {
    // count to 150, then move gem and start count over
    if (this.counter > 150) {
        this.position();
        this.counter = 0;
    } else {
        this.counter++;
    }
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//*****************************
// Instantiate everything
//*****************************

var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3];

var player = new Player();

var gem = new Gem();

//*****************************
// Listen for key presses
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
