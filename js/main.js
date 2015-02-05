
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var music;
var emitter;

function preload(){

    game.load.spritesheet('dude', 'assets/sprites/dogcatcher.png');
    game.load.image('background', 'assets/sprites/back.png');
	game.load.image('dog', 'assets/sprites/scareddog.png');
	game.load.audio('audio', 'assets/audio/Steve Aoki & Rune RK - Bring You To Life (Transcend) Ft. Ras (Adrian Hawkins Remix).mp3');
	game.load.spritesheet('scaredcat', 'assets/sprites/scaredcat.jpg');
}

function create(){

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.desiredFps = 30;
    
	bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    
	game.physics.arcade.gravity.y = 250;
    
	player = game.add.sprite(32, 32, 'dude');
    
	game.physics.enable(player, Phaser.Physics.ARCADE);
    
	player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);
    //player.animations.add('left', [0, 1, 2, 3], 10, true);
    //player.animations.add('turn', [4], 20, true);
    //player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	music = game.add.audio('audio');
	music.play();
	game.input.onDown.add(changeVolume, this);
	
	var mx = game.width - game.cache.getImage('dog').width;
    var my = game.height - game.cache.getImage('dog').height;
	
	for (var i = 0; i < 5; i++){
		var sprite = game.add.sprite(game.rnd.integerInRange(0, mx), game.rnd.integerInRange(0, my), 'dog');
		sprite.animations.add('swim');
		sprite.animations.play('swim', 30, true);
		
		game.add.tween(sprite).to({y : 300}, 2000,  Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
	
        sprite.inputEnabled = true;
        sprite.input.useHandCursor = true;
        sprite.events.onInputDown.add(destroySprite, this);
    }
	emitter = game.add.emitter(game.world.centerX, game.world.centerY, 250);
    emitter.makeParticles('scaredcat', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 200, true, true);
    emitter.minParticleSpeed.setTo(-200, -300);
    emitter.maxParticleSpeed.setTo(200, -400);
    emitter.gravity = 150;
    emitter.bounce.setTo(0.5, 0.5);
    emitter.angularDrag = 30;
    emitter.start(false, 8000, 400);
}

function destroySprite(sprite){

    sprite.destroy();

}

function changeVolume(pointer) {

    if (pointer.y < 300){
        music.volume += 0.1;
    }
    else{
        music.volume -= 0.1;
    }
}

function update() {

    // game.physics.arcade.collide(player, layer);
    player.body.velocity.x = 0;
    if (cursors.left.isDown){
        player.body.velocity.x = -150;

        if (facing != 'left'){
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown){
        player.body.velocity.x = 150;
        if (facing != 'right'){
            player.animations.play('right');
            facing = 'right';
        }
    }
    else{
        if (facing != 'idle'){
            player.animations.stop();
			if (facing == 'left'){
                player.frame = 0;
            }
            else{
                player.frame = 5;
            }
            facing = 'idle';
        }
    }  
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer){
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
	game.physics.arcade.collide(emitter);
}

function render () {

    game.debug.text(game.time.suggestedFps, 32, 32);
    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);
	game.debug.soundInfo(music, 20, 32);
}
