class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    preload() { }
    create() { this.scene.start('StartMenu'); }
}

class StartMenu extends Phaser.Scene {
    constructor() { super('StartMenu'); }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, height/3, 'Water Sort Game', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        const playBtn = this.add.text(width/2, height/2, 'Play Game', { fontSize: '32px', fill: '#0f0' }).setOrigin(0.5).setInteractive();
        playBtn.on('pointerdown', () => this.scene.start('MainGame', { level: 1 }));

        const helpBtn = this.add.text(width/2, height/2 + 60, 'How to Play', { fontSize: '32px', fill: '#ff0' }).setOrigin(0.5).setInteractive();
        helpBtn.on('pointerdown', () => this.scene.start('HowToPlay'));
    }
}

class HowToPlay extends Phaser.Scene {
    constructor() { super('HowToPlay'); }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, 100, 'How to Play', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        const instructions = [
            "1. Click a bottle to select it.",
            "2. Click another bottle to pour water.",
            "3. You can only pour if the top colors match",
            "   or the target bottle is empty.",
            "4. Fill a bottle with 4 segments of the",
            "   same color to get a star.",
            "5. Get enough stars before time runs out!",
            "6. '?' layers are hidden until revealed."
        ];
        this.add.text(width/2, height/2, instructions, { fontSize: '24px', fill: '#ccc', align: 'center' }).setOrigin(0.5);

        const backBtn = this.add.text(width/2, height - 100, 'Back', { fontSize: '32px', fill: '#f00' }).setOrigin(0.5).setInteractive();
        backBtn.on('pointerdown', () => this.scene.start('StartMenu'));
    }
}

class LevelClear extends Phaser.Scene {
    constructor() { super('LevelClear'); }
    init(data) { this.nextLevel = data.level + 1; }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, height/3, 'Level Clear!', { fontSize: '48px', fill: '#0f0' }).setOrigin(0.5);

        const nextBtn = this.add.text(width/2, height/2, 'Next Level', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setInteractive();
        nextBtn.on('pointerdown', () => {
            this.scene.start('MainGame', { level: this.nextLevel });
        });
    }
}

class FinalClear extends Phaser.Scene {
    constructor() { super('FinalClear'); }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, height/3, 'Congratulations!\nYou Beat the Game!', { fontSize: '48px', fill: '#0f0', align: 'center' }).setOrigin(0.5);

        const playBtn = this.add.text(width/2, height/2 + 50, 'Play Again', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setInteractive();
        playBtn.on('pointerdown', () => this.scene.start('StartMenu'));
    }
}

class GameOver extends Phaser.Scene {
    constructor() { super('GameOver'); }
    init(data) { this.level = data.level; }
    create() {
        const { width, height } = this.scale;
        this.add.text(width/2, height/3, 'Time Up!\nGame Over', { fontSize: '48px', fill: '#f00', align: 'center' }).setOrigin(0.5);

        const retryBtn = this.add.text(width/2, height/2 + 50, 'Try Again', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setInteractive();
        retryBtn.on('pointerdown', () => this.scene.start('MainGame', { level: this.level }));
    }
}
