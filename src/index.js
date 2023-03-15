import Phaser from 'phaser';
import sky from './assets/sky.png';
import platform from './assets/platform.png';
import star from './assets/star.png';
import bomb from './assets/bomb.png';
import dude from './assets/dude.png';

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        //загрузка спрайтов
        this.load.image('sky', sky);
        this.load.image('platform', platform);
        this.load.image('star', star);
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
            repeat: 0,
            setXY: {
                x: 300,
                y: 0,
                // stepX: 70
            }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        //добавление платформы и её физики 
        const platforms = this.physics.add.staticGroup();

        //добавление чувака и его физики 
        this.player = this.physics.add.sprite(100, 450, 'dude');

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

        //прикосновение к бомбе
        function hitBomb(player, bomb) {
            this.physics.pause();
            this.player.setTint(0xff000);
            this.player.anims.play("turn");
        }

        //прикосновение игрока к звезде
        let score = 0;

        function collectStar(player, star) {
            star.disableBody(true, true);
            score += 1;
            scoreText.setText('Score: ' + score);
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

        this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
        //работа со счетом игры
        const scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
    }

    //обновление сцены
    update() {
        const cursors = this.input.keyboard.createCursorKeys();
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
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: MyGame,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    }
};


const game = new Phaser.Game(config);