import Phaser from 'phaser';
import sky from '../assets/sky.png';
import space from '../assets/space.png';
import arrows from '../assets/arrows.png';
import start from '../assets/start.png';

class SceneOne extends Phaser.Scene {
	constructor() {
		super("SceneOne");
	}

	preload() {
		this.load.image('sky', sky);
		this.load.image('space', space);
		this.load.image('arrows', arrows);
		this.load.image('start', start);
	}

	create() {
		this.add.image(400, 300, 'sky');

		this.add.image(120, 200, 'arrows');
		this.add.image(120, 380, 'space');
		this.start = this.add.image(this.cameras.main.width / 2, 520, 'start').setInteractive();

		this.add.text(16, 16, 'Начать Игру!', {
			fontSize: '52px',
			fill: '#000'
		});
		this.add.text(16, 90, 'Управление', {
			fontSize: '32px',
			fill: '#000'
		});
		this.add.text(16, 280, 'Выстрел', {
			fontSize: '32px',
			fill: '#000'
		});

		this.start.on('pointerdown', () => {
			this.scene.start('SceneTwo')
		});
	}
}

export default SceneOne