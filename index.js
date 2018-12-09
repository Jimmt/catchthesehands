var gameWidth = 1280,
    gameHeight = 720;
var game = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS, "phaser-container", { preload: preload, create: create, update: update, render: render });

var button, text, controls, lbutton, rbutton, scoreText;
var score = 0;
var max;
var leftKey, rightKey, aKey, dKey;
var leftPrev, rightPrev;
var angleTo = 45;
var cycles = 0;
var lhand, rhand;
var lBox, rBox;
var maxHead, maxHeadRadius = 115;
var handSpeed = 600;
var lresponse, rresponse;
var graphics;
var gameOver = true;
var DEBUG = true;
var tilt = 0;
DEBUG = false;


function preload() {
    game.load.image("lena", "lena.png");
    game.load.image("max", "max.png");	
    game.load.image("hand", "glove.png");
    game.load.image("button", "button.png");
    game.load.image("restartbutton", "restart_button.png");
    game.load.image("controlsbutton", "controls_button.png");
	game.load.image("switchbutton", "switch_button.png");
    game.load.image("lbutton", "l_button.png");
    game.load.image("rbutton", "r_button.png");
}

function click(){
	text.visible = false;
	button.visible = false;
	controls.visible = false;
	// lbutton.visible = false;
	// rbutton.visible = false;
	gameOver = false;
	switchChar.visible = false;
}

function showControls(){
	alert("Punches come from the left and right. Use A/D or left/right arrow keys to dodge these punches to the left and right.")
}

function lpress(){
	tilt = -1;
}
function rpress(){
	tilt = 1;
}

function create() {
    graphics = game.add.graphics(0, 0);

    max = game.add.sprite(0, 0, "max");
    max.scale.set(0.75, 0.75);
    max.anchor.setTo(0.5, 1);
    max.x = gameWidth / 2;
    max.y = gameHeight;

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

    // from left, from right
    lhand = game.add.sprite(0, gameHeight - max.height, "hand");
    rhand = game.add.sprite(gameWidth, gameHeight - max.height, "hand");;
    lhand.anchor.setTo(0, 0.5);
    rhand.anchor.setTo(0, 0.5);
    lhand.y += lhand.height / 2;
    rhand.y += lhand.height / 2;
    lhand.scale.x *= -1;

    maxHead = new SAT.Circle(new SAT.Vector(max.x, max.y), maxHeadRadius);
    rBox = new SAT.Box(new SAT.Vector(rhand.x, rhand.y), rhand.width, rhand.height - 30);
    lBox = new SAT.Box(new SAT.Vector(lhand.x, lhand.y), rhand.width, rhand.height - 30);

    lresponse = new SAT.Response();
    rresponse = new SAT.Response();
    text = game.add.text(gameWidth / 2, gameHeight / 2, "Max Wang Catches Hands", { font: '40px Arial', fill: "#ff0044", align: 'center' });
    scoreText = game.add.text(0, 0, "Score: 0", { font: '40px Arial', fill: "#ff0044", align: 'center' });
    text.x = gameWidth / 2 - text.width / 2;
    text.y = gameHeight / 2 - 100;
    button = game.add.button(gameWidth / 2 - 100, gameHeight / 2 - 50, 'button', click);
    controls = game.add.button(gameWidth / 2 - 100, gameHeight / 2 + 75, 'controlsbutton', showControls);
	switchChar = game.add.button(gameWidth / 2 - 100, gameHeight / 2 + 200, 'switchbutton', 
		function(){
			if(max.key == "max"){
			max.loadTexture("lena");
			text.text = "Lena Catches Hands";
			} else {
			max.loadTexture("max");
			text.text = "Max Wang Catches Hands";
			}
			text.x = gameWidth / 2 - text.width / 2;
			text.y = gameHeight / 2 - 100;
		}
	);
    lbutton = game.add.button(0, gameHeight - 100, 'lbutton', function(){});
    rbutton = game.add.button(gameWidth - 100, gameHeight - 100, 'rbutton', function(){});
    lbutton.events.onInputDown.add(lpress);
    rbutton.events.onInputDown.add(rpress);
    lbutton.events.onInputUp.add(function(){
    	tilt = 0;
    });
    rbutton.events.onInputUp.add(function(){
    	tilt = 0;
    });
}

function punch(cycles) {
    if (cycles / 60 % 2 == 0) {
        score++;
    	scoreText.text = "Score: " + score;
        var fromLeft = Math.random() >= 0.5;
        var hand = fromLeft ? lhand : rhand;
        var startingX = hand.x;
        handSpeed = 700 - 200 * ((cycles / 60) / 30);
        var tween1 = game.add.tween(hand).to({ x: hand.x + (fromLeft ? 1 : -1) * 700 }, handSpeed, "Linear");
        var tween2 = game.add.tween(hand).to({ x: startingX }, handSpeed, "Linear");
        tween1.chain(tween2);
        tween1.start();
    }
}

function makeGameOver(){
	goText = this.game.add.text(gameWidth / 2, gameHeight / 2 - 100, "Game Over", { font: '40px Arial', fill: "#ff0044", align: 'center' });
	goText.anchor.setTo(0.5, 0.5);
	goText.fixedToCamera = true;
	gameOver = true;
	restartButton = game.add.button(gameWidth / 2 - 100, gameHeight / 2 - 50, 'restartbutton', function(){ location.reload(); });
}

function update() {
	if(gameOver) return;
    cycles++;
    var lhit = SAT.testCirclePolygon(maxHead, lBox.toPolygon(), lresponse);
    var rhit = SAT.testCirclePolygon(maxHead, rBox.toPolygon(), rresponse);
    if (lhit || rhit) {
        makeGameOver();
    }
    punch(cycles);
    if (leftKey.isDown || aKey.isDown || tilt < 0) {
        tween = game.add.tween(max).to({ angle: -angleTo }, 100, "Linear", true);
        leftPrev = true;
        // max.angle--;
    } else if (leftPrev) {
        leftPrev = false;
        tween = game.add.tween(max).to({ angle: 0 }, 100, "Linear", true);
    }
    if (rightKey.isDown || dKey.isDown || tilt > 0) {
        tween = game.add.tween(max).to({ angle: angleTo }, 100, "Linear", true);
        rightPrev = true;
        // max.angle++;
    } else if (rightPrev) {
        rightPrev = false;
        tween = game.add.tween(max).to({ angle: 0 }, 100, "Linear", true);
    }

    var radius = max.height - (191 * max.scale.y) / 2;
    var offsetX = Math.cos((max.angle - 90) * Math.PI / 180) * radius;
    var offsetY = Math.sin((max.angle - 90) * Math.PI / 180) * radius;
    maxHead = new SAT.Circle(new SAT.Vector(max.x + offsetX, max.y + offsetY), maxHeadRadius);


    lBox = new SAT.Box(new SAT.Vector(lhand.x + lhand.width, lhand.y - lBox.h / 2), lBox.w, lBox.h);
    rBox = new SAT.Box(new SAT.Vector(rhand.x, rhand.y - rBox.h / 2), lBox.w, lBox.h);
}

function render() {
	if(gameOver) return;
	if(!DEBUG) return;
    graphics.clear();
    graphics.beginFill(0xFF0000);
    graphics.drawCircle(maxHead.pos.x, maxHead.pos.y, maxHeadRadius);
    graphics.drawRect(lBox.pos.x, lBox.pos.y, lBox.w, lBox.h);
    graphics.drawRect(rBox.pos.x, rBox.pos.y, rBox.w, rBox.h);
    graphics.endFill();


    game.world.bringToTop(graphics);
    window.graphics = graphics;
}