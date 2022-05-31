const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 300 },
			debug: false,
		},
	},

	scene: {
		preload: preload,
		create: create,
		update: update,
	},
};

const game = new Phaser.Game(config);

let platforms, cursors, stars, level, score;

function preload() {
	this.load.image("sky", "assets/sky.png");
	this.load.image("ground", "assets/platform.png");
	this.load.image("star", "assets/star.png");
	this.load.image("bomb", "assets/bomb.png");
	this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
}

function create() {
	cursors = this.input.keyboard.createCursorKeys();
	this.add.image(400, 300, "sky");
	platforms = this.physics.add.staticGroup();

	platforms.create(400, 568, "ground").setScale(2).refreshBody();

	platforms.create(600, 400, "ground");
	platforms.create(50, 250, "ground");
	platforms.create(750, 220, "ground");

	player = this.physics.add.sprite(100, 450, "dude");

	player.setBounce(0.2);
	player.setCollideWorldBounds(true);

	// player.body.setGravityY(300);

	this.physics.add.collider(player, platforms);

	this.anims.create({
		key: "left",
		frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1,
	});

	this.anims.create({
		key: "turn",
		frames: [{ key: "dude", frame: 4 }],
		frameRate: 20,
	});

	this.anims.create({
		key: "right",
		frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1,
	});

	stars = this.physics.add.group({
		key: "star",
		repeat: 11,
		setXY: { x: 12, y: 0, stepX: 70 },
	});

	this.physics.add.collider(stars, platforms);
	this.physics.add.overlap(player, stars, collectStar, null, this);

	stars.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	});

	level = this.add.text(349.537, 30, "", { font: '32px "Roboto Slab"', color: "#000" });
	score = this.add.text(730, 20, "", { font: '16px "Roboto Slab"', color: "#000" });

	score.setDataEnabled();
	score.data.set("score", 0);
	score.data.set("level", 1);

	level.setText(`Level ${score.data.get("level")}`);
	score.setText(`Score: ${score.data.get("score")}`);

	function collectStar(player, star) {
		star.disableBody(true, true);
		score.data.values.score += 1;
	}

	score
		.on("changedata-score", (gameObject, value) => {
			gameObject.setText(`Score: ${value}`);
			if (value % 12 == 0) {
				gameObject.data.values.level += 1;
				stars.children.iterate(function (child) {
					child.enableBody(true, child.x, 0, true, true);
				});
			}
		})
		.on("changedata-level", (gameObject, value) => {
			level.setText(`Level ${value}`);
		});

		this.input.on('mousemove')
}

function update() {
	if (cursors.left.isDown) {
		player.setVelocityX(-160);

		player.anims.play("left", true);
	} else if (cursors.right.isDown) {
		player.setVelocityX(160);

		player.anims.play("right", true);
	} else {
		player.setVelocityX(0);

		player.anims.play("turn");
	}

	if (cursors.up.isDown && player.body.touching.down) {
		player.setVelocityY(-330);
	}
}
