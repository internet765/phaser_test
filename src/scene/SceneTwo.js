import Phaser from 'phaser';
import sky from '../assets/sky.png';
import platform from '../assets/platform.png';
import star from '../assets/star.png';
import redStar from '../assets/red-star.png';
import bomb from '../assets/bomb.png';
import dude from '../assets/dude.png';

class SceneTwo extends Phaser.Scene {
	constructor() {
		super("SceneTwo");
	}

	preload() {
		//загрузка спрайтов
		this.load.image('sky', sky);
		this.load.image('platform', platform);
		this.load.image('star', star);
		this.load.image('redStar', redStar);
		this.load.image('bomb', bomb);

		this.load.spritesheet('dude', dude, {
			frameWidth: 32,
			frameHeight: 48
		});
	}

	//создание сцены
	create() {

		//добавление бекграунда
		this.add.image(400, 300, 'sky');

		//добавление бомб
		const bombs = this.physics.add.group();

		//добавление звёзд
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 5,
			setXY: {
				x: 300,
				y: 0,
				stepX: 70
			}
		});

		this.stars.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

		//добавление платформы и её физики 
		const platforms = this.physics.add.staticGroup();

		//добавление чувака и его физики 
		this.player = this.physics.add.sprite(100, 450, 'dude');

		this.collectionStars = this.physics.add.group({
			key: 'redStar',
			active: false,
			visible: false
		});

		//подпрыгивание чувака
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		//анимация чувака
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'turn',
			frames: [{
				key: 'dude',
				frame: 4
			}],
			frameRate: 20
		});
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 5,
				end: 8
			}),
			frameRate: 10,
			repeat: -1
		});

		this.score = 0;

		this.scoreText = this.add.text(16, 16, 'score: 0', {
			fontSize: '32px',
			fill: '#000'
		});

		//создание платформ на холсте, растягивает платформу в два раза
		platforms.create(400, 568, 'platform').setScale(2).refreshBody();
		platforms.create(600, 400, 'platform');
		platforms.create(50, 250, 'platform');
		platforms.create(750, 220, 'platform');

		//добавляет связь между объектами
		this.physics.add.collider(this.player, platforms);
		this.physics.add.collider(this.stars, platforms);
		this.physics.add.collider(bombs, platforms);
		this.physics.add.collider(this.player, bombs, hitBomb, null, this);
		this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
		this.physics.add.collider(this.collectionStars, bombs, neutralizeBomb);

		function neutralizeBomb(collectionStars, bomb) {
			bomb.disableBody(true, true);
		}

		//прикосновение к бомбе
		function hitBomb(player, bomb) {
			this.physics.pause();
			this.player.setTint(0xff000);
			this.player.anims.play("turn");
			this.scene.start('SceneOne')
		}

		//прикосновение игрока к звезде
		function collectStar(player, star) {
			star.disableBody(true, true);
			this.score += 1;
			this.scoreText.setText('Score: ' + this.score);
			if (this.stars.countActive(true) === 0) {
				this.stars.children.iterate(function (child) {
					child.enableBody(true, child.x, 0, true, true);
				});
				let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
				let bomb = bombs.create(x, 16, 'bomb');
				bomb.setBounce(1);
				bomb.setCollideWorldBounds(true);
				bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
			}
		}
	}

	//звездный выстрел
	shooting() {
		if (this.score > 0) {
			this.collectionStars.setActive(true);
			this.collectionStars.setVisible(true);
			this.collectionStars.setXY(this.player.x, this.player.y);
			this.collectionStars.setVelocityY(-300);
			this.score -= 1;
			this.scoreText.setText('Score: ' + this.score);
		}
	}

	//обновление сцены
	update() {
		const cursors = this.input.keyboard.createCursorKeys();
		const spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		if (cursors.left.isDown) {
			this.player.setVelocityX(-160);
			this.player.anims.play('left', true);
		} else if (cursors.right.isDown) {
			this.player.setVelocityX(160);
			this.player.anims.play('right', true);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play('turn');
		}
		if (cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
		}
		if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
			this.shooting();
		}
	}
}


export default SceneTwo