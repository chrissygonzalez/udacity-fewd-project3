// this is the game engine
var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        scoreboard = doc.getElementById('scoreboard'),
        lives = doc.getElementById('lives'),
        gameoverSound = doc.getElementById('gameover');

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    // runs the updates, renders, animation, and game end functions
    function main() {
        // get time delta info
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        // update needs the time delta
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        if (player.howManyLives() > 0) {
            win.requestAnimationFrame(main);
        } else {
        // stop animation, play sound, update lives shown,
        // and show reset button
            gameoverSound.play();
            updateLives();
            player.showReset().onclick = init;
        }
    }

    // initial setup and resetup
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    // call the updates, check if player hit enemies
    function update(dt) {
        updateEntities(dt);
        player.checkCollisions();
    }

    // update everything, check for changes to score, lives, and any collisions
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        gem.update();
        updateScore();
        updateLives();
    }

    // display current score on screen
    function updateScore() {
        scoreboard.innerHTML = player.score();
    }

    // display current lives on screen
    function updateLives() {
        lives.innerHTML = player.howManyLives();
    }

    // render everything
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
    }

    // render the enemies, the player, and the gem
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();

        gem.render();
    }

    // reset the player position, score, lives, enemies, gem, and reset button
    function reset() {
        player.reset();
        player.resetScore();
        player.resetLives();
        enemy1.resetEnemies();
        gem.hideGem();
        player.hideReset();
    }

    // load the images, then start the game
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/gem-orange.png'
    ]);
    Resources.onReady(init);

    // canvas context object
    global.ctx = ctx;
})(this);