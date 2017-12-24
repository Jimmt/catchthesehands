var gameWidth = 1280,
    gameHeight = 720;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, "phaser-container", { preload: preload, create: create, update: update });

var max;
var leftKey, rightKey, aKey, dKey;

function preload() {
    game.load.image("max", "max.png");
}

function create() {
    max = game.add.sprite(0, 0, "max");
    max.scale.set(0.75, 0.75);
    max.anchor.setTo(0.5, 1);
    max.x = gameWidth / 2;
    max.y = gameHeight;

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function update() {
    if (leftKey.isDown || aKey.isDown) {
    	max.angle--;
    }
    if (rightKey.isDown || dKey.isDown) {
    	max.angle++;
    }
}