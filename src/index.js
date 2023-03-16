import SceneOne from './scene/SceneOne';
import SceneTwo from './scene/SceneTwo';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [SceneOne, SceneTwo],
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